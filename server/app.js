const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("", require("./routes/health.routes"));
app.use("/api", require("./routes/all.routes"));

module.exports = app;
