const express = require("express");
const { chatShipment } = require("../controllers/aiController");

const router = express.Router();

//POST /api/ai/track/:tracking_id/chat

router.post("/track/:tracking_id/chat", chatShipment);


module.exports = router;