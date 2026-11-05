const { GoogleGenAI } = require("@google/genai");

// 1. Initialize Gemini Client with API Key
let ai = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log(">>> [Gemini AI Service] Initialized successfully");
} else {
  console.warn(">>> [Gemini AI Service] Warning: GEMINI_API_KEY is missing in .env");
}

/**
 * 2. Chat with Shipment Assistant (Grounded on Real Database Events)
 * @param {Object} params
 * @param {Object} params.shipment - Real database record from MongoDB
 * @param {string} params.userMessage - User ka sawal
 */
async function chatWithShipmentAssistant({ shipment, userMessage }) {
  if (!ai) {
    throw new Error("Gemini AI is not configured. Please verify GEMINI_API_KEY.");
  }

  // Database se aaye hue timeline events ko readable list me convert kar rahe hain
  const formattedEvents = (shipment.events || []).map((e, index) => {
    const time = new Date(e.createdAt).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
    return `${index + 1}. [${time}] Status: ${e.status} | Location: ${e.location || "N/A"} | Note: ${e.description}`;
  }).join("\n");

  // 3. System Prompt & Grounding (Interviewer ko batane ke liye sabse important part)
  const systemInstruction = `
You are ShipNex AI Concierge, a polite, helpful logistics assistant.
Your job is to answer customer questions strictly based on the provided shipment data.

RULES:
1. ONLY state facts present in the provided shipment data. Never guess or hallucinate.
2. If the user asks something not in the data (e.g. driver private phone), politely decline and ask them to contact support.
3. Keep answers concise, clear, and reassuring (maximum 2-3 sentences).
4. If customer writes in Hindi/Hinglish, reply in friendly Hinglish. If in English, reply in English.

CURRENT SHIPMENT DATA:
- Tracking Number: ${shipment.trackingNumber}
- Sender: ${shipment.senderName} (${shipment.senderAddress})
- Receiver: ${shipment.receiverName} (${shipment.receiverAddress})
- Weight: ${shipment.weight} kg
- Overall Status: ${shipment.status}

TIMELINE EVENTS:
${formattedEvents || "No events recorded yet. Package pending pickup."}
  `.trim();

  // 4. Model Call
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userMessage,
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.3, // Low temperature = factual & strictly accurate
    },
  });

  return response.text ? response.text.trim() : "I am currently unable to process your request. Please try again shortly.";
}

module.exports = {
  chatWithShipmentAssistant,
};
