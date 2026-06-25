const express = require("express");
const { trackShipment, predictDelivery } = require("../controllers/trackController");

const router = express.Router();

router.get("/:tracking_id", trackShipment);
router.get("/:tracking_id/predict", predictDelivery);

module.exports = router;
