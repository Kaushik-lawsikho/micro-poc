// Request/Response Transformation Middleware
const config = require('../config');

// Request transformation middleware
const transformRequest = (req, res, next) => {
  // Add request ID for tracking
  req.requestId = generateRequestId();
  
  // Add timestamp
  req._startAt = process.hrtime();
  
  // Transform request body if needed
  if (req.body && req.headers['content-type'] === 'application/json') {
    // Add metadata to request
    req.metadata = {
      timestamp: new Date().toISOString(),
      requestId: req.requestId,
      environment: req.environment || 'unknown',
      source: req.headers['user-agent'] || 'unknown'
    };
    
    // Log request transformation
    console.log(`Request transformed: ${req.method} ${req.url}`, {
      requestId: req.requestId,
      bodySize: JSON.stringify(req.body).length,
      metadata: req.metadata
    });
  }
  
  next();
};

// Response transformation middleware
const transformResponse = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    // Transform response data
    const transformedData = {
      data: data,
      metadata: {
        requestId: req.requestId,
        timestamp: new Date().toISOString(),
        environment: req.environment || 'unknown',
        processingTime: req._startAt ? 
          (process.hrtime(req._startAt)[0] * 1000 + process.hrtime(req._startAt)[1] / 1000000).toFixed(2) : 'unknown'
      }
    };
    
    // Add response headers
    res.set({
      'X-Request-ID': req.requestId,
      'X-Environment': req.environment || 'unknown',
      'X-Processing-Time': transformedData.metadata.processingTime
    });
    
    originalJson.call(this, transformedData);
  };
  
  next();
};

// Error response transformation
const transformErrorResponse = (err, req, res, next) => {
  const errorResponse = {
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'INTERNAL_ERROR',
      statusCode: err.statusCode || 500
    },
    metadata: {
      requestId: req.requestId,
      timestamp: new Date().toISOString(),
      environment: req.environment || 'unknown',
      path: req.path,
      method: req.method
    }
  };
  
  // Add error response headers
  res.set({
    'X-Request-ID': req.requestId,
    'X-Environment': req.environment || 'unknown',
    'Content-Type': 'application/json'
  });
  
  res.status(errorResponse.error.statusCode).json(errorResponse);
};

// Generate unique request ID
const generateRequestId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Data validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    if (!schema) return next();
    
    try {
      // Basic validation - you can extend this with Joi or similar
      if (schema.required && schema.required.length > 0) {
        for (const field of schema.required) {
          if (!req.body[field]) {
            return res.status(400).json({
              error: 'Validation Error',
              message: `Field '${field}' is required`,
              requestId: req.requestId
            });
          }
        }
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  transformRequest,
  transformResponse,
  transformErrorResponse,
  validateRequest
};
