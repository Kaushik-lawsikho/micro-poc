const express = require("express");
const bodyParser = require("body-parser");
const AppDataSource = require("./data-source");
const userRoutes = require("./routes/userRoutes");
const healthRoutes = require("./routes/healthRoutes");

const app = express();
app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Users DB connected");
    app.use("/users", userRoutes);
    app.use("/health", healthRoutes);

    // Root health check
    app.get("/", (req, res) => {
      res.json({
        success: true,
        service: "Users Service",
        status: "healthy",
        timestamp: new Date().toISOString()
      });
    });

    app.listen(4001, () => {
      console.log("Users service running on http://localhost:4001");
    });
  })
  .catch((err) => console.error("DB connection error:", err));
