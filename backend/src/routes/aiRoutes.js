const express = require("express");
const { chatShipment } = require("../controllers/aiController");

const router = express.Router();

router.post("/chat", chatShipment);
router.post("/track/:tracking_id/chat", chatShipment);


module.exports = router;