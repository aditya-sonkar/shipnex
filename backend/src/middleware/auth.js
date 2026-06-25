const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "shipnex-secret-key-12345";

function authenticateToken(req, res, next) {
  const token = req.cookies["shipnex-session"];

  if (!token) {
    return res.status(401).json({ error: "Access denied. No session token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired session token." });
  }
}

function requireRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: Insufficient privileges." });
    }

    next();
  };
}

module.exports = {
  authenticateToken,
  requireRole
};
