const express = require("express");
const router = express.Router();
const AppDataSource = require("../data-source");

// Test endpoint to verify service is working
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Users Service is working!",
    timestamp: new Date().toISOString()
  });
});

// GET /users - Get all users
router.get("/", async (req, res) => {
  try {
    const userRepo = AppDataSource.getRepository("User");
    const users = await userRepo.find();
    res.json({
      success: true,
      data: users,
      count: users.length,
      message: "Users retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Database error",
      message: error.message
    });
  }
});

// GET /users/:id - Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const userRepo = AppDataSource.getRepository("User");
    const user = await userRepo.findOne({ where: { id: parseInt(req.params.id) } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
        message: `User with ID ${req.params.id} not found`
      });
    }
    
    res.json({
      success: true,
      data: user,
      message: "User retrieved successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Database error",
      message: error.message
    });
  }
});

// POST /users - Create new user
router.post("/", async (req, res) => {
  console.log("Users Service: POST /users received");
  console.log("Request body:", req.body);
  console.log("Request headers:", req.headers);
  
  try {
    const userRepo = AppDataSource.getRepository("User");
    console.log("Creating user with data:", req.body);
    const newUser = userRepo.create(req.body);
    console.log("Saving user to database...");
    const saved = await userRepo.save(newUser);
    console.log("User saved successfully:", saved);
    
    res.status(201).json({
      success: true,
      data: saved,
      message: "User created successfully"
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      success: false,
      error: "Database error",
      message: error.message
    });
  }
});

// PUT /users/:id - Update user
router.put("/:id", async (req, res) => {
  try {
    const userRepo = AppDataSource.getRepository("User");
    const user = await userRepo.findOne({ where: { id: parseInt(req.params.id) } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
        message: `User with ID ${req.params.id} not found`
      });
    }
    
    userRepo.merge(user, req.body);
    const updated = await userRepo.save(user);
    
    res.json({
      success: true,
      data: updated,
      message: "User updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Database error",
      message: error.message
    });
  }
});

// DELETE /users/:id - Delete user
router.delete("/:id", async (req, res) => {
  try {
    const userRepo = AppDataSource.getRepository("User");
    const user = await userRepo.findOne({ where: { id: parseInt(req.params.id) } });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
        message: `User with ID ${req.params.id} not found`
      });
    }
    
    await userRepo.remove(user);
    
    res.json({
      success: true,
      message: "User deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Database error",
      message: error.message
    });
  }
});

// Keep the old routes for backward compatibility
router.get("/see", async (req, res) => {
  try {
    const userRepo = AppDataSource.getRepository("User");
    const users = await userRepo.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/add", async (req, res) => {
  try {
    const userRepo = AppDataSource.getRepository("User");
    const newUser = userRepo.create(req.body);
    const saved = await userRepo.save(newUser);
    res.json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
