// Enhanced API Gateway with Authentication, Throttling, Logging, and Transformation
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const helmet = require('helmet');
const cors = require('cors');

// Import configuration and middleware
const config = require('./config');
const { authenticateApiKey } = require('./middleware/auth');
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

// Authentication middleware for protected routes
app.use('/users', authenticateApiKey);
app.use('/orders', authenticateApiKey);

// Enhanced proxy middleware with error handling
const createEnhancedProxy = (target, serviceName) => {
  return createProxyMiddleware({
    target,
    changeOrigin: true,
    logLevel: 'silent', // We handle logging ourselves
    onError: (err, req, res) => {
      console.error(`Proxy error for ${serviceName}:`, err.message);
      res.status(503).json({
        success: false,
        error: 'Service Unavailable',
        message: `${serviceName} service is currently unavailable`,
        requestId: req.requestId,
        timestamp: new Date().toISOString()
      });
    },
    onProxyReq: (proxyReq, req, res) => {
      // Add custom headers for tracking
      proxyReq.setHeader('X-Request-ID', req.requestId);
      proxyReq.setHeader('X-Environment', req.environment);
      proxyReq.setHeader('X-API-Key', req.apiKey);
      
      console.log(`Proxying request to ${serviceName}: ${req.method} ${req.url}`);
    },
    onProxyRes: (proxyRes, req, res) => {
      // Add response headers
      proxyRes.headers['X-Request-ID'] = req.requestId;
      proxyRes.headers['X-Environment'] = req.environment;
      proxyRes.headers['X-Processing-Time'] = req._startAt ? 
        (process.hrtime(req._startAt)[0] * 1000 + process.hrtime(req._startAt)[1] / 1000000).toFixed(2) : 'unknown';
    }
  });
};

// Proxy routes with enhanced error handling
app.use('/users', createEnhancedProxy(config.SERVICES.users, 'Users'));
app.use('/orders', createEnhancedProxy(config.SERVICES.orders, 'Orders'));

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
