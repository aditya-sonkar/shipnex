const express = require("express");
const { getPublicPartners, createPartner } = require("../controllers/partnerController");
const { authenticateToken, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", getPublicPartners);
router.post("/", authenticateToken, requireRole(["admin", "superadmin"]), createPartner);

module.exports = router;