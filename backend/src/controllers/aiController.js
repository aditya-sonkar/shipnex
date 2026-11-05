const prisma = require("../prismaClient");
const { chatWithShipmentAssistant } = require("../services/aiService");

/**
 * Handle AI Tracking Chat
 * Route: POST /api/ai/chat or POST /api/ai/track/:tracking_id/chat
 * Body: { message: "Where is my package?", history: [], tracking_id?: "SX-12345" }
 */
const chatShipment = async (req, res) => {
  const { message, history = [] } = req.body;
  const trackingParam = req.params.tracking_id || req.body.tracking_id;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    let shipment = null;
    let queryCode = trackingParam ? trackingParam.trim().toUpperCase() : null;

    // If tracking code not in param, search inside user message (e.g. "Status of SX-10473")
    if (!queryCode) {
      const match = message.match(/\bSX-[A-Za-z0-9]+\b/i);
      if (match) queryCode = match[0].toUpperCase();
    }

    // Look up real shipment from MongoDB
    if (queryCode) {
      shipment = await prisma.shipment.findUnique({
        where: { trackingNumber: queryCode },
        include: {
          events: {
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }

    // Call Gemini LLM with grounded DB data (or as general ShipNex concierge if no code yet)
    const reply = await chatWithShipmentAssistant({
      shipment,
      searchedCode: queryCode,
      userMessage: message.trim(),
      history,
    });

    return res.status(200).json({
      reply,
      trackingNumber: queryCode || (shipment ? shipment.trackingNumber : null),
    });
  } catch (error) {
    console.error(">>> [AI Controller Error]:", error);
    return res.status(500).json({
      error: "Unable to process AI inquiry at this moment.",
      details: error.message,
    });
  }
};

module.exports = {
  chatShipment,
};
