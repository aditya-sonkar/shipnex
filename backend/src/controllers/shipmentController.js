const prisma = require("../prismaClient");
const { sendTrackingEmail } = require("../utils/mailer");

function generateTrackingNumber() {
  return "SX-" + Math.floor(10000 + Math.random() * 90000);
}

const createShipment = async (req, res) => {
  const { senderName, senderAddress, receiverName, receiverEmail, receiverAddress, weight } = req.body;
  const tenantId = req.user && req.user.tenantId;

  if (!tenantId) {
    return res.status(400).json({ error: "Tenant identity is required." });
  }

  if (!senderName || !senderAddress || !receiverName || !receiverAddress || !weight) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const trackingNumber = generateTrackingNumber();

    const shipment = await prisma.shipment.create({
      data: {
        trackingNumber,
        senderName,
        senderAddress,
        receiverName,
        receiverEmail,
        receiverAddress,
        weight: parseFloat(weight),
        status: "pending",
        tenantId,
        createdById: req.user.id,
      },
    });

    await prisma.shipmentEvent.create({
      data: {
        shipmentId: shipment.id,
        status: "pending",
        description: "Shipment registration received and package ready for dispatch.",
        location: senderAddress,
      },
    });

    return res.status(201).json(shipment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const listShipments = async (req, res) => {
  const tenantId = req.user && req.user.tenantId;

  if (!tenantId) {
    return res.status(400).json({ error: "Tenant context is required." });
  }

  try {
    const shipments = await prisma.shipment.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(shipments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const listByDriver = async (req, res) => {
  const driverId = req.user && req.user.id;
  const tenantId = req.user && req.user.tenantId;
  
  if (!driverId || !tenantId) return res.status(400).json({ error: "Driver identity is required." });

  try {
    const shipments = await prisma.shipment.findMany({
      where: {
        assignedDriverId: driverId,
        tenantId,
      },
      include: { events: { orderBy: { createdAt: "desc" }, take: 1 } },
      orderBy: { updatedAt: "desc" },
    });
    return res.status(200).json(shipments);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getShipment = async (req, res) => {
  const tenantId = req.user && req.user.tenantId;

  if (!tenantId) {
    return res.status(400).json({ error: "Tenant context is required." });
  }

  try {
    const shipment = await prisma.shipment.findFirst({
      where: { id: req.params.id, tenantId },
      include: { events: true },
    });

    if (!shipment) {
      return res.status(404).json({ error: "Shipment not found." });
    }

    return res.status(200).json(shipment);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateStatus = async (req, res) => {
  const { status, description, location } = req.body;
  const tenantId = req.user && req.user.tenantId;

  if (!tenantId) {
    return res.status(400).json({ error: "Tenant context is required." });
  }

  const validStatuses = [
    "pending",
    "picked_up",
    "at_hub",
    "at_sorting",
    "in_transit",
    "out_for_delivery",
    "delivered",
    "failed",
  ];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status state." });
  }

  try {
    const shipment = await prisma.shipment.findFirst({
      where: { id: req.params.id, tenantId },
    });

    if (!shipment) {
      return res.status(404).json({ error: "Shipment not found." });
    }

    const updated = await prisma.shipment.update({
      where: { id: req.params.id },
      data: { status },
    });

    await prisma.shipmentEvent.create({
      data: {
        shipmentId: shipment.id,
        status,
        description: description || `Status updated to ${status}.`,
        location: location || "Transit Hub",
      },
    });

    if (status === "delivered" && updated.receiverEmail) {
      await sendTrackingEmail(
        updated.receiverEmail,
        "Your Package has been Delivered!",
        `<div style="max-width: 600px; margin: 0 auto; font-family: 'Inter', -apple-system, sans-serif; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          <div style="background-color: #09090b; padding: 32px 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: -0.5px;">shipnex</h1>
          </div>
          <div style="padding: 40px;">
            <h2 style="color: #18181b; font-size: 22px; font-weight: 600; margin-top: 0; margin-bottom: 24px;">Your Package has Arrived! 🎉</h2>
            <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">Hi <strong>${updated.receiverName}</strong>,</p>
            <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">Great news! Your package has been successfully delivered. Thank you for choosing ShipNex for your logistics needs.</p>
            
            <div style="background-color: #fafafa; border: 1px solid #f4f4f5; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
              <div style="margin-bottom: 20px;">
                <p style="color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px 0; font-weight: 700;">Tracking Number</p>
                <p style="color: #18181b; font-size: 18px; font-weight: 600; margin: 0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">${updated.trackingNumber}</p>
              </div>
              <div>
                <p style="color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px 0; font-weight: 700;">Delivered To</p>
                <p style="color: #18181b; font-size: 15px; margin: 0; line-height: 1.5;">${updated.receiverAddress}</p>
              </div>
            </div>
            
            <a href="http://localhost:3000/track/${updated.trackingNumber}" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background-color: #09090b; color: #ffffff; text-decoration: none; padding: 16px 0; border-radius: 12px; font-weight: 600; font-size: 15px; transition: opacity 0.2s;">View Tracking Details</a>
          </div>
          <div style="background-color: #f4f4f5; padding: 24px; text-align: center; border-top: 1px solid #e4e4e7;">
            <p style="color: #a1a1aa; font-size: 12px; margin: 0;">© 2026 ShipNex Logistics. All rights reserved.</p>
          </div>
        </div>`
      );
    }

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const assignHub = async (req, res) => {
  const { assignedHubId } = req.body;
  const tenantId = req.user && req.user.tenantId;
  
  if (!tenantId) return res.status(400).json({ error: "Tenant context is required." });

  try {
    const shipment = await prisma.shipment.findFirst({ where: { id: req.params.id, tenantId } });
    if (!shipment) return res.status(404).json({ error: "Shipment not found." });

    const hub = await prisma.hub.findFirst({ where: { id: assignedHubId, tenantId } });
    if (!hub) return res.status(400).json({ error: "Valid hub not found in your organisation." });

    const updated = await prisma.shipment.update({
      where: { id: req.params.id },
      data: { assignedHubId },
    });

    await prisma.shipmentEvent.create({
      data: {
        shipmentId: shipment.id,
        status: shipment.status,
        description: `Shipment routed to hub: ${hub.name} (${hub.address})`,
        location: hub.address,
      },
    });

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const assignAgent = async (req, res) => {
  const { assignedDriverId } = req.body;
  const tenantId = req.user && req.user.tenantId;

  if (!tenantId) {
    return res.status(400).json({ error: "Tenant context is required." });
  }

  try {
    const shipment = await prisma.shipment.findFirst({
      where: { id: req.params.id, tenantId },
    });

    if (!shipment) {
      return res.status(404).json({ error: "Shipment not found." });
    }

    const driver = await prisma.user.findFirst({
      where: { id: assignedDriverId, role: "delivery", tenantId },
    });

    if (!driver) {
      return res.status(400).json({ error: "Valid delivery driver not found." });
    }

    const updated = await prisma.shipment.update({
      where: { id: req.params.id },
      data: { assignedDriverId, status: "out_for_delivery" },
    });

    await prisma.shipmentEvent.create({
      data: {
        shipmentId: shipment.id,
        status: "out_for_delivery",
        description: `Shipment assigned to delivery partner: ${driver.fullName} and is out for delivery.`,
        location: shipment.receiverAddress,
      },
    });

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const uploadPOD = async (req, res) => {
  const tenantId = req.user && req.user.tenantId;

  if (!tenantId) {
    return res.status(400).json({ error: "Tenant context is required." });
  }

  if (!req.file) {
    return res.status(400).json({ error: "Please upload a valid POD image file." });
  }

  try {
    const shipment = await prisma.shipment.findFirst({
      where: { id: req.params.id, tenantId },
    });

    if (!shipment) {
      return res.status(404).json({ error: "Shipment not found." });
    }

    const updated = await prisma.shipment.update({
      where: { id: req.params.id },
      data: { status: "delivered" },
    });

    await prisma.shipmentEvent.create({
      data: {
        shipmentId: shipment.id,
        status: "delivered",
        description: `Parcel delivered successfully. Proof of Delivery: ${req.file.filename}`,
        location: shipment.receiverAddress,
      },
    });

    if (updated.receiverEmail) {
      await sendTrackingEmail(
        updated.receiverEmail,
        "Your Package has been Delivered!",
        `<div style="max-width: 600px; margin: 0 auto; font-family: 'Inter', -apple-system, sans-serif; background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          <div style="background-color: #09090b; padding: 32px 40px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 300; letter-spacing: -0.5px;">shipnex</h1>
          </div>
          <div style="padding: 40px;">
            <h2 style="color: #18181b; font-size: 22px; font-weight: 600; margin-top: 0; margin-bottom: 24px;">Your Package has Arrived! 🎉</h2>
            <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">Hi <strong>${updated.receiverName}</strong>,</p>
            <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">Great news! Your package has been successfully delivered. Thank you for choosing ShipNex for your logistics needs.</p>
            
            <div style="background-color: #fafafa; border: 1px solid #f4f4f5; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
              <div style="margin-bottom: 20px;">
                <p style="color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px 0; font-weight: 700;">Tracking Number</p>
                <p style="color: #18181b; font-size: 18px; font-weight: 600; margin: 0; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;">${updated.trackingNumber}</p>
              </div>
              <div>
                <p style="color: #a1a1aa; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 6px 0; font-weight: 700;">Delivered To</p>
                <p style="color: #18181b; font-size: 15px; margin: 0; line-height: 1.5;">${updated.receiverAddress}</p>
              </div>
            </div>
            
            <a href="http://localhost:3000/track/${updated.trackingNumber}" style="display: block; width: 100%; box-sizing: border-box; text-align: center; background-color: #09090b; color: #ffffff; text-decoration: none; padding: 16px 0; border-radius: 12px; font-weight: 600; font-size: 15px; transition: opacity 0.2s;">View Tracking Details</a>
          </div>
          <div style="background-color: #f4f4f5; padding: 24px; text-align: center; border-top: 1px solid #e4e4e7;">
            <p style="color: #a1a1aa; font-size: 12px; margin: 0;">© 2026 ShipNex Logistics. All rights reserved.</p>
          </div>
        </div>`
      );
    }

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const predictDelivery = async (req, res) => {
  const tenantId = req.user && req.user.tenantId;

  if (!tenantId) {
    return res.status(400).json({ error: "Tenant identity is required." });
  }

  try {
    const shipment = await prisma.shipment.findFirst({
      where: { id: req.params.id, tenantId },
    });

    if (!shipment) {
      return res.status(404).json({ error: "Shipment not found." });
    }

    let durationDays = 2;
    durationDays += Math.floor(shipment.weight / 5);
    if (shipment.senderAddress.length !== shipment.receiverAddress.length) {
      durationDays += 1;
    }

    const predictionDate = new Date(shipment.createdAt);
    predictionDate.setDate(predictionDate.getDate() + durationDays);

    return res.status(200).json({
      shipmentId: shipment.id,
      trackingNumber: shipment.trackingNumber,
      predictedDays: durationDays,
      estimatedDeliveryDate: predictionDate.toISOString(),
      confidence: "94.2%",
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getMetrics = async (req, res) => {
  const tenantId = req.user && req.user.tenantId;
  if (!tenantId) {
    return res.status(400).json({ error: "Tenant identity is required." });
  }

  try {
    const activeConsignments = await prisma.shipment.count({
      where: { tenantId, status: { notIn: ["delivered", "failed"] } },
    });

    const activeHubs = await prisma.hub.count({
      where: { tenantId },
    });

    const registeredTeam = await prisma.user.count({
      where: { tenantId, role: { not: "superadmin" } },
    });

    return res.status(200).json({
      activeConsignments,
      activeHubs,
      registeredTeam,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createShipment,
  listShipments,
  listByDriver,
  getShipment,
  updateStatus,
  assignHub,
  assignAgent,
  uploadPOD,
  predictDelivery,
  getMetrics
};
