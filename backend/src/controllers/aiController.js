const prisma = require("../prismaClient");
const { chatWithShipmentAssistant } = require("../services/aiService");

/** 
 * Handle AI Tracking chat
 * Route: POST api/ai/track/:tracking_id/chat
 * Body: { message: "Where is my package?"}
 */

const chatShipment = async (req, res) => {
    const { tracking_id } = req.params;
    const { message, history = [] } = req.body;

    //1. Validation: check if the message is empty or not 

    if (!message || !message.trim()) {
        return res.status(400).json({ error: "Message is required." });
    }

    if (!tracking_id) {
        return res.status(400).json({ error: "Tracking ID is required" });
    }

    try {
        const cleanTrackingId = tracking_id.trim().toUpperCase();
        // 2. Database lookup (MongoDB via Prisma)
        const shipment = await prisma.shipment.findUnique({
            where: { trackingNumber: cleanTrackingId },
            include: {
                events: {
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!shipment) {
            return res.status(400).json({ error: "Consignment tracking code not found." });
        }

        //3. AI Service Call

        const reply = await chatWithShipmentAssistant({
            shipment,
            userMessage: message.trim(), history
        });

        // 4. Response to client

        return res.status(200).json({ reply });
    } catch (error) {
        console.error(">>> [AI Controller Error]:", error);
        return res.status(500).json({
            error: "Unable to process AI inquiry at this moment.",
            details: error.message
        });
    }
};
module.exports = {
    chatShipment,
};
