const express = require("express");
const router = express.Router();
const AppDataSource = require("../data-source");

router.get("/", async (req, res) => {
  const orderRepo = AppDataSource.getRepository("Order");
  const orders = await orderRepo.find();
  res.json(orders);
});

router.post("/", async (req, res) => {
  const orderRepo = AppDataSource.getRepository("Order");
  const newOrder = orderRepo.create(req.body);
  const saved = await orderRepo.save(newOrder);
  res.json(saved);
});

module.exports = router;
