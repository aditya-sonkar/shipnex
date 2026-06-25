const express = require("express");
const {
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
} = require("../controllers/authController");
const { authenticateToken, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authenticateToken, me);
router.post("/register-member", authenticateToken, requireRole(["admin"]), registerMember);
router.get("/users", authenticateToken, requireRole(["admin", "hub"]), listUsers);
router.delete("/users/:id", authenticateToken, requireRole(["admin"]), deleteMember);
router.post("/logout", logout);

// Superadmin routes
router.get("/tenants", authenticateToken, requireRole(["superadmin"]), listTenants);
router.patch("/tenants/:id/toggle", authenticateToken, requireRole(["superadmin"]), toggleTenant);
router.patch("/tenants/:id/plan", authenticateToken, requireRole(["superadmin"]), updateTenantPlan);

module.exports = router;
