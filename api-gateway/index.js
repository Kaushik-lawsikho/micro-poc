// Enhanced API Gateway with Authentication, Throttling, Logging, and Transformation

// Suppress deprecation warnings
process.removeAllListeners('warning');
process.on('warning', (warning) => {
  if (warning.name !== 'DeprecationWarning') {
    console.warn(warning.name, warning.message);
  }
});

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const helmet = require('helmet');
const cors = require('cors');

// Import configuration and middleware
const config = require('./config');
const { globalRateLimiter, authRateLimiter } = require('./middleware/throttling');
const { requestLogger, responseLogger, errorLogger } = require('./middleware/logging');
const { transformRequest, transformResponse, transformErrorResponse } = require('./middleware/transformation');

// Import routes
const mockRoutes = require('./routes/mockRoutes');
const healthRoutes = require('./routes/healthRoutes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors(config.CORS));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Global rate limiting
app.use(globalRateLimiter);

// Request transformation middleware
app.use(transformRequest);

// Response transformation middleware
app.use(transformResponse);

// Logging middleware
app.use(requestLogger);
app.use(responseLogger);

// Health check routes (no authentication required)
app.use('/health', healthRoutes);

// Mock API routes (no authentication required for learning)
app.use('/mock', mockRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    service: 'API Gateway',
    version: '1.0.0',
    environment: config.NODE_ENV,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      mock: '/mock',
      users: '/users',
      orders: '/orders'
    },
    documentation: 'This API Gateway demonstrates various features including authentication, throttling, logging, and request/response transformation.'
  });
});

// API Documentation endpoint
app.get('/docs', (req, res) => {
  res.json({
    success: true,
    title: 'API Gateway Documentation',
    version: '1.0.0',
    environment: config.NODE_ENV,
    features: [
      'API Key Authentication',
      'Rate Limiting & Throttling',
      'Request/Response Transformation',
      'Comprehensive Logging',
      'Health Monitoring',
      'Mock API Endpoints',
      'Service Proxy Integration'
    ],
    authentication: {
      method: 'API Key',
      header: 'x-api-key or Authorization: Bearer <key>',
      keys: {
        development: config.API_KEYS.development,
        production: config.API_KEYS.production
      }
    },
    rateLimiting: {
      global: `${config.RATE_LIMIT.max} requests per ${config.RATE_LIMIT.windowMs / 1000 / 60} minutes`,
      auth: '5 requests per 15 minutes for authentication endpoints'
    },
    endpoints: {
      'GET /': 'Gateway information',
      'GET /docs': 'This documentation',
      'GET /health': 'Basic health check',
      'GET /health/detailed': 'Detailed health check with service status',
      'GET /health/ready': 'Readiness check',
      'GET /health/live': 'Liveness check',
      'GET /mock/users': 'Get mock users (no auth required)',
      'GET /mock/products': 'Get mock products (no auth required)',
      'GET /users/*': 'Users service endpoints (auth required)',
      'GET /orders/*': 'Orders service endpoints (auth required)'
    }
  });
});

// Authentication middleware
const authenticateApiKey = (req, res, next) => {
  console.log(`Auth middleware: ${req.method} ${req.url}`);
  console.log(`Headers:`, req.headers);
  
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  
  if (!apiKey) {
    console.log('No API key provided');
    return res.status(401).json({
      error: 'API key is required',
      message: 'Please provide an API key in the x-api-key header or Authorization header'
    });
  }
  
  const validApiKeys = Object.values(config.API_KEYS);
  console.log(`Valid API keys:`, validApiKeys);
  console.log(`Provided API key:`, apiKey);
  
  if (!validApiKeys.includes(apiKey)) {
    console.log('Invalid API key provided');
    return res.status(403).json({
      error: 'Invalid API key',
      message: 'The provided API key is not valid'
    });
  }
  
  console.log('API key authentication successful');
  console.log('Calling next() to proceed to proxy middleware...');
  
  // Add environment info to request for logging/debugging
  req.environment = config.NODE_ENV;
  req.apiKey = apiKey;
  
  next();
};

// Note: Using direct axios calls instead of proxy middleware for better reliability

// Test route without authentication first
app.use('/test-proxy', createProxyMiddleware({
  target: config.SERVICES.users,
  changeOrigin: true,
  logLevel: 'debug'
}));

// Simple test route to verify middleware chaining
app.get('/users/test-simple', authenticateApiKey, (req, res) => {
  console.log('Simple test route reached!');
  res.json({
    success: true,
    message: 'Simple test route working!',
    requestId: req.requestId
  });
});

// Protected routes with authentication and proxy
console.log('Setting up /users route with authentication and proxy...');

// Simple working solution - handle all /users routes manually
app.all('/users', (req, res) => {
  console.log(`Handling ${req.method} ${req.url}`);
  
  // Authentication
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  
  if (!apiKey) {
    return res.status(401).json({
      error: 'API key is required',
      message: 'Please provide an API key in the x-api-key header or Authorization header'
    });
  }
  
  const validApiKeys = Object.values(config.API_KEYS);
  if (!validApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: 'Invalid API key',
      message: 'The provided API key is not valid'
    });
  }
  
  console.log('API key authentication successful');
  console.log(`Proxying request to Users: ${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  
  // Use axios to make the request to Users Service
  const axios = require('axios');
  const targetUrl = `${config.SERVICES.users}${req.url}`;
  
  console.log(`Target URL: ${targetUrl}`);
  
  // Forward the request
  axios({
    method: req.method,
    url: targetUrl,
    data: req.body,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': req.headers['x-api-key'],
      'user-agent': req.headers['user-agent']
    }
  })
  .then(response => {
    console.log('Response from Users Service:', response.status);
    console.log('Response data:', response.data);
    res.status(response.status).json(response.data);
  })
  .catch(error => {
    console.error('Error calling Users Service:', error.message);
    console.error('Error details:', error.response?.data);
    res.status(503).json({
      success: false,
      error: 'Service Unavailable',
      message: 'Users service is currently unavailable',
      details: error.message
    });
  });
});

app.all('/users/*', (req, res) => {
  console.log(`Handling ${req.method} ${req.url}`);
  
  // Authentication
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  
  if (!apiKey) {
    return res.status(401).json({
      error: 'API key is required',
      message: 'Please provide an API key in the x-api-key header or Authorization header'
    });
  }
  
  const validApiKeys = Object.values(config.API_KEYS);
  if (!validApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: 'Invalid API key',
      message: 'The provided API key is not valid'
    });
  }
  
  console.log('API key authentication successful');
  console.log(`Proxying request to Users: ${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  
  // Use axios to make the request to Users Service
  const axios = require('axios');
  const targetUrl = `${config.SERVICES.users}${req.url}`;
  
  console.log(`Target URL: ${targetUrl}`);
  
  // Forward the request
  axios({
    method: req.method,
    url: targetUrl,
    data: req.body,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': req.headers['x-api-key'],
      'user-agent': req.headers['user-agent']
    }
  })
  .then(response => {
    console.log('Response from Users Service:', response.status);
    console.log('Response data:', response.data);
    res.status(response.status).json(response.data);
  })
  .catch(error => {
    console.error('Error calling Users Service:', error.message);
    console.error('Error details:', error.response?.data);
    res.status(503).json({
      success: false,
      error: 'Service Unavailable',
      message: 'Users service is currently unavailable',
      details: error.message
    });
  });
});

console.log('Setting up /orders route with authentication and proxy...');

// Simple working solution - handle all /orders routes manually
app.all('/orders', (req, res) => {
  console.log(`Handling ${req.method} ${req.url}`);
  
  // Authentication
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  
  if (!apiKey) {
    return res.status(401).json({
      error: 'API key is required',
      message: 'Please provide an API key in the x-api-key header or Authorization header'
    });
  }
  
  const validApiKeys = Object.values(config.API_KEYS);
  if (!validApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: 'Invalid API key',
      message: 'The provided API key is not valid'
    });
  }
  
  console.log('API key authentication successful');
  console.log(`Proxying request to Orders: ${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  
  // Use axios to make the request to Orders Service
  const axios = require('axios');
  const targetUrl = `${config.SERVICES.orders}${req.url}`;
  
  console.log(`Target URL: ${targetUrl}`);
  
  // Forward the request
  axios({
    method: req.method,
    url: targetUrl,
    data: req.body,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': req.headers['x-api-key'],
      'user-agent': req.headers['user-agent']
    }
  })
  .then(response => {
    console.log('Response from Orders Service:', response.status);
    console.log('Response data:', response.data);
    res.status(response.status).json(response.data);
  })
  .catch(error => {
    console.error('Error calling Orders Service:', error.message);
    console.error('Error details:', error.response?.data);
    res.status(503).json({
      success: false,
      error: 'Service Unavailable',
      message: 'Orders service is currently unavailable',
      details: error.message
    });
  });
});

app.all('/orders/*', (req, res) => {
  console.log(`Handling ${req.method} ${req.url}`);
  
  // Authentication
  const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
  
  if (!apiKey) {
    return res.status(401).json({
      error: 'API key is required',
      message: 'Please provide an API key in the x-api-key header or Authorization header'
    });
  }
  
  const validApiKeys = Object.values(config.API_KEYS);
  if (!validApiKeys.includes(apiKey)) {
    return res.status(403).json({
      error: 'Invalid API key',
      message: 'The provided API key is not valid'
    });
  }
  
  console.log('API key authentication successful');
  console.log(`Proxying request to Orders: ${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  
  // Use axios to make the request to Orders Service
  const axios = require('axios');
  const targetUrl = `${config.SERVICES.orders}${req.url}`;
  
  console.log(`Target URL: ${targetUrl}`);
  
  // Forward the request
  axios({
    method: req.method,
    url: targetUrl,
    data: req.body,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': req.headers['x-api-key'],
      'user-agent': req.headers['user-agent']
    }
  })
  .then(response => {
    console.log('Response from Orders Service:', response.status);
    console.log('Response data:', response.data);
    res.status(response.status).json(response.data);
  })
  .catch(error => {
    console.error('Error calling Orders Service:', error.message);
    console.error('Error details:', error.response?.data);
    res.status(503).json({
      success: false,
      error: 'Service Unavailable',
      message: 'Orders service is currently unavailable',
      details: error.message
    });
  });
});

// 404 handler - catch all unmatched routes
app.use('/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      '/',
      '/docs',
      '/health',
      '/mock',
      '/users',
      '/orders'
    ]
  });
});

// Error handling middleware
app.use(errorLogger);
app.use(transformErrorResponse);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
    requestId: req.requestId,
    timestamp: new Date().toISOString(),
    environment: req.environment || 'unknown'
  });
});

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${config.NODE_ENV}`);
  console.log(`🔑 API Keys: ${Object.keys(config.API_KEYS).join(', ')}`);
  console.log(`📝 Documentation: http://localhost:${PORT}/docs`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`);
  console.log(`🎭 Mock API: http://localhost:${PORT}/mock`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

module.exports = app;
