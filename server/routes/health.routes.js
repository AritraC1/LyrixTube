const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// Health check endpoint
router.get("/health", (req, res) => {
  return res.status(200).json({ status: "ok" });
});

// DB connectivity check endpoint
router.get("/db-health", (req, res) => {
  const state = mongoose.connection.readyState;

  const statusMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const isHealthy = state === 1;

  return res.status(isHealthy ? 200 : 503).json({
    mongodb: statusMap[state] || "unknown",
    state,
    status: isHealthy ? "healthy" : "unhealthy",
  });
});

module.exports = router;
