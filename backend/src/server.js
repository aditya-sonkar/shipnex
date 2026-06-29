const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");
const trackRoutes = require("./routes/trackRoutes");
const hubRoutes = require("./routes/hubRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Health check endpoint for deployment validation
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// ── MOUNT ROUTES ──────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/shipments", shipmentRoutes);
app.use("/api/track", trackRoutes);
app.use("/api/hubs", hubRoutes);

// Start listening
app.listen(PORT, () => {
  console.log(`>>> [ShipNex Backend] Multi-tenant Server running on port ${PORT}`);
});
