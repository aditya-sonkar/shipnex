const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../prismaClient");

const JWT_SECRET = process.env.JWT_SECRET || "shipnex-secret-key-12345";

const signup = async (req, res) => {
  const { email, fullName, password, companyName, role } = req.body;

  if (!email || !fullName || !password) {
    return res.status(400).json({ error: "Email, Full Name, and Password are required." });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const assignedRole = role === "superadmin" ? "superadmin" : "admin";

    let tenantId = undefined;

    if (assignedRole === "admin") {
      const tenantName = companyName || `${fullName}'s Courier Org`;
      let tenant = await prisma.tenant.findUnique({ where: { name: tenantName } });
      if (!tenant) {
        tenant = await prisma.tenant.create({
          data: {
            name: tenantName,
            subscriptionPlan: "free",
            isActive: true,
          },
        });
      }
      tenantId = tenant.id;
    }

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        fullName,
        passwordHash,
        role: assignedRole,
        tenantId,
      },
    });

    return res.status(201).json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      tenantId: user.tenantId,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ error: "Email, Password, and Role are required." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { tenant: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    if (user.role !== role && !(user.role === "superadmin" && role === "admin")) {
      return res.status(403).json({ error: `Access denied. Registered role: ${user.role}` });
    }

    // Auto-heal admin missing tenantId
    let updatedUser = user;
    if (user.role === "admin" && !user.tenantId) {
      const tenantName = `${user.fullName}'s Courier Org`;
      let tenant = await prisma.tenant.findUnique({ where: { name: tenantName } });
      if (!tenant) {
        tenant = await prisma.tenant.create({
          data: {
            name: tenantName,
            subscriptionPlan: "free",
            isActive: true,
          },
        });
      }
      updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: { tenantId: tenant.id },
        include: { tenant: true },
      });
    }

    const token = jwt.sign(
      {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        tenantId: updatedUser.tenantId || undefined,
        fullName: updatedUser.fullName,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("shipnex-session", token, {
      httpOnly: true,
      secure: false, // Set to true in production
      maxAge: 86400000,
      sameSite: "lax",
    });

    return res.status(200).json({
      id: updatedUser.id,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      role: updatedUser.role,
      tenantId: updatedUser.tenantId,
      companyName: updatedUser.tenant ? updatedUser.tenant.name : null,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const me = async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Not logged in." });

  try {
    let user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { tenant: true },
    });

    if (!user) {
      res.clearCookie("shipnex-session");
      return res.status(401).json({ error: "User session expired." });
    }

    // Auto-heal admin missing tenantId
    if (user.role === "admin" && !user.tenantId) {
      const tenantName = `${user.fullName}'s Courier Org`;
      let tenant = await prisma.tenant.findUnique({ where: { name: tenantName } });
      if (!tenant) {
        tenant = await prisma.tenant.create({
          data: {
            name: tenantName,
            subscriptionPlan: "free",
            isActive: true,
          },
        });
      }
      user = await prisma.user.update({
        where: { id: user.id },
        data: { tenantId: tenant.id },
        include: { tenant: true },
      });

      // Regenerate token since tenantId changed
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId,
          fullName: user.fullName,
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.cookie("shipnex-session", token, {
        httpOnly: true,
        secure: false, // Set to true in production
        maxAge: 86400000,
        sameSite: "lax",
      });
    }

    return res.status(200).json({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      tenantId: user.tenantId,
      companyName: user.tenant ? user.tenant.name : null,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const registerMember = async (req, res) => {
  const { fullName, email, password, role } = req.body;
  const adminTenantId = req.user && req.user.tenantId;

  if (!adminTenantId) {
    return res.status(400).json({ error: "Admin must belong to a tenant." });
  }

  if (!fullName || !email || !password || !role) {
    return res.status(400).json({ error: "All fields are required." });
  }

  if (!["hub", "delivery"].includes(role)) {
    return res.status(400).json({ error: "Role must be either 'hub' or 'delivery'." });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        fullName,
        passwordHash,
        role,
        tenantId: adminTenantId,
      },
    });

    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const listUsers = async (req, res) => {
  const tenantId = req.user && req.user.tenantId;
  if (!tenantId) return res.status(400).json({ error: "Tenant required." });

  try {
    const users = await prisma.user.findMany({
      where: { tenantId },
      select: { id: true, fullName: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const logout = (req, res) => {
  res.clearCookie("shipnex-session");
  return res.status(200).json({ message: "Logout successful." });
};

const listTenants = async (req, res) => {
  try {
    const tenants = await prisma.tenant.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { users: true, shipments: true } } },
    });
    return res.status(200).json(tenants);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const toggleTenant = async (req, res) => {
  try {
    const tenant = await prisma.tenant.findUnique({ where: { id: req.params.id } });
    if (!tenant) return res.status(404).json({ error: "Tenant not found." });

    const updated = await prisma.tenant.update({
      where: { id: req.params.id },
      data: { isActive: !tenant.isActive },
    });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateTenantPlan = async (req, res) => {
  const { subscriptionPlan } = req.body;
  const validPlans = ["free", "premium", "enterprise"];

  if (!subscriptionPlan || !validPlans.includes(subscriptionPlan)) {
    return res.status(400).json({ error: "Invalid subscription plan." });
  }

  try {
    const updated = await prisma.tenant.update({
      where: { id: req.params.id },
      data: { subscriptionPlan },
    });
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteMember = async (req, res) => {
  const adminTenantId = req.user && req.user.tenantId;

  if (!adminTenantId) {
    return res.status(400).json({ error: "Tenant context required." });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { id: req.params.id, tenantId: adminTenantId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found in your organisation." });
    }

    if (user.role === "admin") {
      return res.status(403).json({ error: "Cannot delete an admin account via this endpoint." });
    }

    await prisma.user.delete({ where: { id: req.params.id } });
    return res.status(200).json({ message: "Member removed successfully." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signup,
  login,
  me,
  registerMember,
  listUsers,
  logout,
  listTenants,
  toggleTenant,
  updateTenantPlan,
  deleteMember
};




