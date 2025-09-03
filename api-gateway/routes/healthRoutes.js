// Health Check Routes for API Gateway
const express = require('express');
const router = express.Router();
const axios = require('axios');
const config = require('../config');

// GET /health - Basic health check
router.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'API Gateway',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
    version: '1.0.0'
  });
});

// GET /health/detailed - Detailed health check
router.get('/detailed', async (req, res) => {
  const healthStatus = {
    success: true,
    service: 'API Gateway',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
    version: '1.0.0',
    services: {},
    system: {
      memory: process.memoryUsage(),
      platform: process.platform,
      nodeVersion: process.version,
      pid: process.pid
    }
  };

  try {
    // Check Users Service
    try {
      const usersResponse = await axios.get(`${config.SERVICES.users}/health`, { timeout: 5000 });
      healthStatus.services.users = {
        status: 'healthy',
        responseTime: usersResponse.headers['x-response-time'] || 'unknown',
        statusCode: usersResponse.status
      };
    } catch (error) {
      healthStatus.services.users = {
        status: 'unhealthy',
        error: error.message,
        statusCode: error.response?.status || 'timeout'
      };
      healthStatus.status = 'degraded';
    }

    // Check Orders Service
    try {
      const ordersResponse = await axios.get(`${config.SERVICES.orders}/health`, { timeout: 5000 });
      healthStatus.services.orders = {
        status: 'healthy',
        responseTime: ordersResponse.headers['x-response-time'] || 'unknown',
        statusCode: ordersResponse.status
      };
    } catch (error) {
      healthStatus.services.orders = {
        status: 'unhealthy',
        error: error.message,
        statusCode: error.response?.status || 'timeout'
      };
      healthStatus.status = 'degraded';
    }

    // Determine overall status
    const unhealthyServices = Object.values(healthStatus.services).filter(service => service.status === 'unhealthy');
    if (unhealthyServices.length > 0) {
      healthStatus.status = 'degraded';
      if (unhealthyServices.length === Object.keys(healthStatus.services).length) {
        healthStatus.status = 'unhealthy';
      }
    }

  } catch (error) {
    healthStatus.status = 'error';
    healthStatus.error = error.message;
  }

  res.json(healthStatus);
});

// GET /health/ready - Readiness check
router.get('/ready', (req, res) => {
  // Check if the gateway is ready to accept requests
  const isReady = true; // You can add more sophisticated readiness checks here
  
  if (isReady) {
    res.json({
      success: true,
      service: 'API Gateway',
      status: 'ready',
      timestamp: new Date().toISOString(),
      message: 'API Gateway is ready to accept requests'
    });
  } else {
    res.status(503).json({
      success: false,
      service: 'API Gateway',
      status: 'not_ready',
      timestamp: new Date().toISOString(),
      message: 'API Gateway is not ready to accept requests'
    });
  }
});

// GET /health/live - Liveness check
router.get('/live', (req, res) => {
  // Check if the gateway process is alive
  res.json({
    success: true,
    service: 'API Gateway',
    status: 'alive',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    pid: process.pid
  });
});

module.exports = router;
