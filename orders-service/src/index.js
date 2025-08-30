const express = require("express");
const bodyParser = require("body-parser");
const AppDataSource = require("./data-source");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(bodyParser.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Orders DB connected");
    app.use("/orders", orderRoutes);

    app.listen(4002, () => {
      console.log("Orders service running on http://localhost:4002");
    });
  })
  .catch((err) => console.error("DB connection error:", err));
