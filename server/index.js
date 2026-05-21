require("dotenv").config();

const app = require("./app");
const connectToMongoDB = require("./config/db");

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectToMongoDB();
  app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
  });
};

startServer();
