const prisma = require("../prismaClient");
const { getCache, setCache } = require("../utils/redisClient");
const { GoogleGenAI } = require("@google/genai");

let ai = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log(">>> [Gemini API] Initialized successfully for delivery predictions");
} else {
  console.warn(">>> [Gemini API] GEMINI_API_KEY is not set. Using fallback heuristic prediction model.");
}

const trackShipment = async (req, res) => {
  const trackingId = req.params.tracking_id;
  const cacheKey = `shipment:tracking:${trackingId}`;

  try {
    // 1. Attempt to fetch from Redis cache 
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      console.log(`[Cache Hit] Tracking loaded from Redis for sx:${trackingId}`);
      return res.status(200).json(cachedData);
    }

    const shipment = await prisma.shipment.findUnique({
      where: { trackingNumber: trackingId },
      include: {
        events: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!shipment) {
      return res.status(404).json({ error: "tracking code not found." });
    }

    // Cache the query results for 1 hour (3600)
    await setCache(cacheKey, shipment, 3600);
    console.log(`[Cache Miss] Loaded from Database and stored in Redis for sx: ${trackingId}`);

    return res.status(200).json(shipment);
  }
  catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const predictDelivery = async (req, res) => {
  const trackingId = req.params.tracking_id;
  const cacheKey = `shipment:prediction:${trackingId}`;

  try {
    // 1. Attempt to fetch from Redis cache
    const cachedData = await getCache(cacheKey);
    if (cachedData) {
      console.log(`[Cache Hit] Prediction loaded from Redis for sx:${trackingId}`);
      return res.status(200).json(cachedData);
    }

    const shipment = await prisma.shipment.findUnique({
      where: { trackingNumber: trackingId },
    });

    if (!shipment) {
      return res.status(404).json({ error: "Consignment tracking code not found." });
    }

    // If Gemini key is set, use GenAI!
    if (ai) {
      try {
        const prompt = `
          Estimate the courier delivery time in days between these two addresses:
          From: "${shipment.senderAddress}"
          To: "${shipment.receiverAddress}"
          Package Weight: ${shipment.weight} kg.
          
          Respond ONLY with a raw JSON object containing these keys:
          {
            "predictedDays": (integer number of days, e.g., 3),
            "confidence": (percentage string, e.g., "89.5%"),
            "reasoning": (one short sentence explanation of the estimate, e.g., "Interstate transit time based on distance.")
          }
        `;

        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        const textResponse = response.text.trim();
        // Extract JSON if it contains markdown formatting blocks
        const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const prediction = JSON.parse(jsonMatch[0]);
          let predictedDays = prediction.predictedDays;
          let baseDate = new Date(shipment.createdAt);

          // Adjust based on current status progress
          if (shipment.status === "out_for_delivery") {
            predictedDays = 0; // Today!
            baseDate = new Date(shipment.updatedAt);
          } else if (shipment.status === "in_transit") {
            predictedDays = Math.max(1, Math.floor(predictedDays / 3));
            baseDate = new Date(shipment.updatedAt);
          } else if (shipment.status === "at_sorting" || shipment.status === "at_hub" || shipment.status === "picked_up") {
            predictedDays = Math.max(1, Math.floor(predictedDays / 2));
            baseDate = new Date(shipment.updatedAt);
          }

          const predictionDate = new Date(baseDate);
          predictionDate.setDate(predictionDate.getDate() + predictedDays);
          
          const result = {
            predictedDays: predictedDays,
            estimatedDeliveryDate: predictionDate.toISOString(),
            confidence: prediction.confidence,
            reasoning: shipment.status === "out_for_delivery" ? "Out for delivery with courier today." : prediction.reasoning,
            source: "Gemini AI"
          };

          // Cache the successful Gemini prediction in Redis!
          await setCache(cacheKey, result, 3600);
          console.log(`[Cache Miss] Saved Gemini prediction to Redis for sx:${trackingId}`);

          return res.status(200).json(result);
        }
      } catch (aiError) {
        console.error(">>> [Gemini API] Failed to generate prediction. Falling back to heuristic:", aiError.message);
      }
    }

    // Heuristic Fallback Logic (if AI is down, key is missing, or parsing fails)
    let durationDays = 2;
    durationDays += Math.floor(shipment.weight / 5);
    
    // Check if state/city is different as a better heuristic than string length
    const getRegion = (addr) => {
      const parts = addr.split(",");
      return parts.length > 1 ? parts[parts.length - 2].trim().toLowerCase() : addr.trim().toLowerCase();
    };
    
    if (getRegion(shipment.senderAddress) !== getRegion(shipment.receiverAddress)) {
      durationDays += 2; // interstate
    }

    let baseDate = new Date(shipment.createdAt);

    // Adjust based on current status progress
    if (shipment.status === "out_for_delivery") {
      durationDays = 0; // Today!
      baseDate = new Date(shipment.updatedAt);
    } else if (shipment.status === "in_transit") {
      durationDays = Math.max(1, Math.floor(durationDays / 3));
      baseDate = new Date(shipment.updatedAt);
    } else if (shipment.status === "at_sorting" || shipment.status === "at_hub" || shipment.status === "picked_up") {
      durationDays = Math.max(1, Math.floor(durationDays / 2));
      baseDate = new Date(shipment.updatedAt);
    }

    const predictionDate = new Date(baseDate);
    predictionDate.setDate(predictionDate.getDate() + durationDays);

    const fallbackResult = {
      predictedDays: durationDays,
      estimatedDeliveryDate: predictionDate.toISOString(),
      confidence: shipment.status === "out_for_delivery" ? "99.0%" : "80.0%",
      reasoning: shipment.status === "out_for_delivery" ? "Out for delivery with partner today." : "Rule-based fallback estimation.",
      source: "Heuristic"
    };

    // Cache fallback result with a short TTL (e.g., 30s) so it retries Gemini soon
    await setCache(cacheKey, fallbackResult, 30);

    return res.status(200).json(fallbackResult);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  trackShipment,
  predictDelivery
};
