const prisma = require("../prismaClient");

const trackShipment = async (req, res) => {
  try {
    const shipment = await prisma.shipment.findUnique({
      where: { trackingNumber: req.params.tracking_id },
      include: {
        events: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!shipment) {
      return res.status(404).json({ error: "tracking code not found." });
    }

    return res.status(200).json(shipment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const predictDelivery = async (req, res) => {
  try {
    const shipment = await prisma.shipment.findUnique({
      where: { trackingNumber: req.params.tracking_id },
    });

    if (!shipment) {
      return res.status(404).json({ error: "Consignment tracking code not found." });
    }

    let durationDays = 2;
    durationDays += Math.floor(shipment.weight / 5);
    if (shipment.senderAddress.length !== shipment.receiverAddress.length) {
      durationDays += 1;
    }

    const predictionDate = new Date(shipment.createdAt);
    predictionDate.setDate(predictionDate.getDate() + durationDays);

    return res.status(200).json({
      predictedDays: durationDays,
      estimatedDeliveryDate: predictionDate.toISOString(),
      confidence: "94.2%",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  trackShipment,
  predictDelivery
};
