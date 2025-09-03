// Throttling and Rate Limiting Middleware
const rateLimit = require('express-rate-limit');
const config = require('../config');

// Global rate limiter
const globalRateLimiter = rateLimit({
  windowMs: config.RATE_LIMIT.windowMs,
  max: config.RATE_LIMIT.max,
  message: {
    error: 'Rate limit exceeded',
    message: config.RATE_LIMIT.message,
    retryAfter: Math.ceil(config.RATE_LIMIT.windowMs / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Rate limit exceeded',
      message: config.RATE_LIMIT.message,
      retryAfter: Math.ceil(config.RATE_LIMIT.windowMs / 1000),
      timestamp: new Date().toISOString()
    });
  }
});

// Stricter rate limiter for authentication endpoints
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts',
    message: 'Too many authentication attempts, please try again later',
    retryAfter: 900
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter for specific endpoints
const endpointRateLimiter = (maxRequests, windowMs = 15 * 60 * 1000) => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    message: {
      error: 'Endpoint rate limit exceeded',
      message: `Too many requests to this endpoint, please try again later`,
      retryAfter: Math.ceil(windowMs / 1000)
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

module.exports = {
  globalRateLimiter,
  authRateLimiter,
  endpointRateLimiter
};
