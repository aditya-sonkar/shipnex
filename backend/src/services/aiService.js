const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini Client
let ai = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  console.log(">>> [Gemini AI Service] Initialized successfully");
} else {
  console.warn(">>> [Gemini AI Service] Warning: GEMINI_API_KEY is missing in .env");
}

/**
 * Chat with Shipment Assistant (Nexi)
 * Uses high-limit models: gemini-flash-lite-latest with fallback to gemini-3.1-flash-lite
 */
async function chatWithShipmentAssistant({ shipment, searchedCode, userMessage, history = [] }) {
  if (!ai) {
    throw new Error("Gemini AI is not configured. Please verify GEMINI_API_KEY in .env.");
  }

  const conversationContext = (history || [])
    .slice(-6)
    .map((h) => `${h.role === "user" ? "Customer" : "Assistant"}: ${h.content}`)
    .join("\n");

  let systemInstruction = "";

  if (shipment) {
    // Grounded on real database manifest
    const formattedEvents = (shipment.events || []).map((e, index) => {
      const time = new Date(e.createdAt).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });
      return `${index + 1}. [${time}] Status: ${e.status} | Location: ${e.location || "N/A"} | Note: ${e.description}`;
    }).join("\n");

    systemInstruction = `
You are Nexi, the smart AI virtual assistant for ShipNex freight & parcel tracking.
Answer the customer strictly based on their real shipment manifest below.

RULES:
1. ONLY state facts present in the provided shipment data. Never hallucinate fake delivery dates or drivers.
2. If customer asks for something not in the data, explain politely that it is not yet registered on the manifest and suggest contacting support.
3. Keep answers concise, clear, and reassuring (maximum 2-3 sentences).
4. LANGUAGE RULE: ALWAYS speak in clear, professional English by default. ONLY switch to Hindi or Hinglish IF AND ONLY IF the user writes their question in Hindi or Hinglish.

CURRENT SHIPMENT DATA:
- Tracking Number: ${shipment.trackingNumber}
- Sender: ${shipment.senderName} (${shipment.senderAddress})
- Receiver: ${shipment.receiverName} (${shipment.receiverAddress})
- Weight: ${shipment.weight} kg
- Overall Status: ${shipment.status}

TIMELINE EVENTS:
${formattedEvents || "Package registered, pending pickup scan."}
${conversationContext ? `\nPREVIOUS TURNS:\n${conversationContext}` : ""}
    `.trim();
  } else if (searchedCode) {
    // Tracking code was searched, but not found in MongoDB
    systemInstruction = `
You are Nexi, the smart AI assistant for ShipNex.
The customer asked about tracking number "${searchedCode}", but this tracking number was NOT found in the ShipNex shipment database.
Politely inform them that tracking code "${searchedCode}" was not found in our live database, advise them to double check the code (format: SX-XXXXX), or offer to help if they have another consignment ID.
LANGUAGE RULE: ALWAYS respond in clear English by default. ONLY reply in Hindi/Hinglish if the user asks in Hindi/Hinglish.
${conversationContext ? `\nPREVIOUS TURNS:\n${conversationContext}` : ""}
    `.trim();
  } else {
    // General shipping query or greeting
    systemInstruction = `
You are Nexi, the smart virtual assistant for ShipNex.
Your role is to greet customers warmly, answer questions about how ShipNex tracking works, and guide them to provide their tracking number (format: SX-XXXXX) so you can pull up live coordinates and timeline history.
Be friendly, natural, and helpful. Keep responses to 2 sentences.
LANGUAGE RULE: ALWAYS respond in clear English by default. ONLY reply in Hindi/Hinglish if the user asks in Hindi/Hinglish.
${conversationContext ? `\nPREVIOUS TURNS:\n${conversationContext}` : ""}
    `.trim();
  }

  // High-limit model list with automatic fallback
  const modelsToTry = ["gemini-flash-lite-latest", "gemini-3.1-flash-lite"];

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: userMessage,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn(`>>> [Nexi AI] Model ${model} failed, trying fallback:`, err?.status || err?.message);
    }
  }

  return "I am currently unable to process your inquiry. Please try again in a moment.";
}

module.exports = {
  chatWithShipmentAssistant,
};
