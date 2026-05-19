const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const allRoutes = require("./routes/all.routes");
const healthRoutes = require("./routes/health.routes");
const connectToMongoDB = require("./config/db");

dotenv.config();

// Declarations
const app = express();
const PORT_NUMBER = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Endpoints
app.use("/", healthRoutes);
app.use("/api", allRoutes);

// Start Server
const startServer = async () => {
  await connectToMongoDB(); // wait for DB to start first

  app.listen(PORT_NUMBER, () => {
    console.log(`Server is running on ${PORT_NUMBER}`);
  });
};

startServer();
