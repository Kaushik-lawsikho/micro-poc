// Mock Routes for Learning HTTP API Basics
const express = require('express');
const router = express.Router();

// Mock data for demonstration
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user' }
];

const mockProducts = [
  { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
  { id: 2, name: 'Mouse', price: 29.99, category: 'Electronics' },
  { id: 3, name: 'Keyboard', price: 79.99, category: 'Electronics' }
];

// GET /mock/users - Get all mock users
router.get('/users', (req, res) => {
  res.json({
    success: true,
    data: mockUsers,
    count: mockUsers.length,
    message: 'Mock users retrieved successfully'
  });
});

// GET /mock/users/:id - Get user by ID
router.get('/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: 'User not found',
      message: `No user found with ID ${userId}`
    });
  }
  
  res.json({
    success: true,
    data: user,
    message: 'User retrieved successfully'
  });
});

// POST /mock/users - Create new mock user
router.post('/users', (req, res) => {
  const { name, email, role } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Name and email are required'
    });
  }
  
  const newUser = {
    id: mockUsers.length + 1,
    name,
    email,
    role: role || 'user'
  };
  
  mockUsers.push(newUser);
  
  res.status(201).json({
    success: true,
    data: newUser,
    message: 'User created successfully'
  });
});

// GET /mock/products - Get all mock products
router.get('/products', (req, res) => {
  res.json({
    success: true,
    data: mockProducts,
    count: mockProducts.length,
    message: 'Mock products retrieved successfully'
  });
});

// GET /mock/products/:id - Get product by ID
router.get('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id);
  const product = mockProducts.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      error: 'Product not found',
      message: `No product found with ID ${productId}`
    });
  }
  
  res.json({
    success: true,
    data: product,
    message: 'Product retrieved successfully'
  });
});

// GET /mock/health - Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// GET /mock/status - Status information
router.get('/status', (req, res) => {
  res.json({
    success: true,
    service: 'Mock API Service',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /mock/users',
      'GET /mock/users/:id',
      'POST /mock/users',
      'GET /mock/products',
      'GET /mock/products/:id',
      'GET /mock/health',
      'GET /mock/status'
    ]
  });
});

module.exports = router;
