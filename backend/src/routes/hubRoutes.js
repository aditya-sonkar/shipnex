const express = require("express");
const { createHub, listHubs, deleteHub } = require("../controllers/hubController");
const { authenticateToken, requireRole } = require("../middleware/auth");

const router = express.Router();

router.post("/", authenticateToken, requireRole(["admin"]), createHub);
router.get("/", authenticateToken, requireRole(["admin", "hub"]), listHubs);
router.delete("/:id", authenticateToken, requireRole(["admin"]), deleteHub);

module.exports = router;
