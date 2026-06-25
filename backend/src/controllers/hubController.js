const prisma = require("../prismaClient");

const createHub = async (req, res) => {
  const { name, address } = req.body;
  const tenantId = req.user && req.user.tenantId;

  if (!tenantId) {
    return res.status(400).json({ error: "Tenant context is required." });
  }

  if (!name || !address) {
    return res.status(400).json({ error: "Hub name and address are required." });
  }

  try {
    const hub = await prisma.hub.create({
      data: { name, address, tenantId },
    });
    return res.status(201).json(hub);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const listHubs = async (req, res) => {
  const tenantId = req.user && req.user.tenantId;

  if (!tenantId) {
    return res.status(400).json({ error: "Tenant context is required." });
  }

  try {
    const hubs = await prisma.hub.findMany({
      where: { tenantId },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(hubs);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteHub = async (req, res) => {
  const tenantId = req.user && req.user.tenantId;

  if (!tenantId) {
    return res.status(400).json({ error: "Tenant context is required." });
  }

  try {
    const hub = await prisma.hub.findFirst({
      where: { id: req.params.id, tenantId },
    });

    if (!hub) {
      return res.status(404).json({ error: "Hub not found in your organisation." });
    }

    await prisma.hub.delete({ where: { id: req.params.id } });
    return res.status(200).json({ message: "Hub deleted successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createHub,
  listHubs,
  deleteHub
};
