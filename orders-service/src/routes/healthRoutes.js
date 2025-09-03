// Health Check Routes for Orders Service
const express = require('express');
const router = express.Router();

// GET /health - Basic health check
router.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'Orders Service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// GET /health/detailed - Detailed health check
router.get('/detailed', (req, res) => {
  res.json({
    success: true,
    service: 'Orders Service',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    system: {
      memory: process.memoryUsage(),
      platform: process.platform,
      nodeVersion: process.version,
      pid: process.pid
    }
  });
});

module.exports = router;
