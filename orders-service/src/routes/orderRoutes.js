const express = require("express");
const router = express.Router();
const AppDataSource = require("../data-source");

router.get("/", async (req, res) => {
  try {
    const orderRepo = AppDataSource.getRepository("Order");
    const orders = await orderRepo.find();
    res.json({
      success: true,
      data: orders,
      count: orders.length,
      message: "Orders retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Database error",
      message: error.message
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const orderRepo = AppDataSource.getRepository("Order");
    const newOrder = orderRepo.create(req.body);
    const saved = await orderRepo.save(newOrder);
    res.status(201).json({
      success: true,
      data: saved,
      message: "Order created successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Database error",
      message: error.message
    });
  }
});

// PUT /orders/:id - Update order
router.put("/:id", async (req, res) => {
  try {
    const orderRepo = AppDataSource.getRepository("Order");
    const order = await orderRepo.findOne({ where: { id: parseInt(req.params.id) } });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
        message: `No order found with ID ${req.params.id}`
      });
    }
    
    orderRepo.merge(order, req.body);
    const updated = await orderRepo.save(order);
    
    res.json({
      success: true,
      data: updated,
      message: "Order updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Database error",
      message: error.message
    });
  }
});

// DELETE /orders/:id - Delete order
router.delete("/:id", async (req, res) => {
  try {
    const orderRepo = AppDataSource.getRepository("Order");
    const order = await orderRepo.findOne({ where: { id: parseInt(req.params.id) } });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found",
        message: `No order found with ID ${req.params.id}`
      });
    }
    
    await orderRepo.remove(order);
    
    res.json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Database error",
      message: error.message
    });
  }
});

module.exports = router;
