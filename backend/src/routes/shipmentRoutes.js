const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createShipment,
  listShipments,
  getShipment,
  updateStatus,
  assignAgent,
  uploadPOD,
  predictDelivery,
  assignHub,
  listByDriver,
  getMetrics
} = require("../controllers/shipmentController");
const { authenticateToken, requireRole } = require("../middleware/auth");

const router = express.Router();

const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/metrics", authenticateToken, requireRole(["admin", "superadmin"]), getMetrics);
router.post("/", authenticateToken, requireRole(["admin"]), createShipment);
router.get("/mine", authenticateToken, requireRole(["delivery"]), listByDriver);
router.get("/", authenticateToken, listShipments);
router.get("/:id", authenticateToken, getShipment);
router.post("/:id/status", authenticateToken, requireRole(["admin", "hub", "delivery"]), updateStatus);
router.post("/:id/assign-agent", authenticateToken, requireRole(["admin", "hub"]), assignAgent);
router.post("/:id/assign-hub", authenticateToken, requireRole(["admin"]), assignHub);
router.post("/:id/upload-pod", authenticateToken, requireRole(["delivery"]), upload.single("pod"), uploadPOD);
router.get("/:id/predict", authenticateToken, predictDelivery);

module.exports = router;
