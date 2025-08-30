const express = require("express");
const bodyParser = require("body-parser");
const AppDataSource = require("./data-source");
const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(bodyParser.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Users DB connected");
    app.use("/users", userRoutes);

    app.listen(4001, () => {
      console.log("Users service running on http://localhost:4001");
    });
  })
  .catch((err) => console.error("DB connection error:", err));
