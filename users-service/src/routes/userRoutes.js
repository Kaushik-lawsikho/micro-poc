const express = require("express");
const router = express.Router();
const AppDataSource = require("../data-source");

router.get("/see", async (req, res) => {
  const userRepo = AppDataSource.getRepository("User");
  const users = await userRepo.find();
  res.json(users);
});

router.post("/add", async (req, res) => {
  const userRepo = AppDataSource.getRepository("User");
  const newUser = userRepo.create(req.body);
  const saved = await userRepo.save(newUser);
  res.json(saved);
});

module.exports = router;
