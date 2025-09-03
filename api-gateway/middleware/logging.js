// Logging Middleware
const morgan = require('morgan');
const winston = require('winston');
const config = require('../config');

// Configure Winston logger
const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Custom morgan format for detailed logging
morgan.token('body', (req) => JSON.stringify(req.body));
morgan.token('response-time', (req, res) => {
  if (!res._header || !req._startAt) return '';
  const diff = process.hrtime(req._startAt);
  const ms = diff[0] * 1e3 + diff[1] * 1e-6;
  return ms.toFixed(3);
});

// Request logging middleware
const requestLogger = morgan((tokens, req, res) => {
  const logData = {
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    responseTime: tokens['response-time'](req, res),
    contentLength: tokens.res(req, res, 'content-length'),
    userAgent: tokens['user-agent'](req, res),
    remoteAddr: tokens['remote-addr'](req, res),
    timestamp: new Date().toISOString(),
    environment: req.environment || 'unknown',
    apiKey: req.apiKey ? req.apiKey.substring(0, 8) + '...' : 'none'
  };
  
  logger.info('HTTP Request', logData);
  return JSON.stringify(logData);
});

// Response logging middleware
const responseLogger = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    const responseData = {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseSize: data ? data.length : 0,
      timestamp: new Date().toISOString(),
      environment: req.environment || 'unknown',
      processingTime: req._startAt ? 
        (process.hrtime(req._startAt)[0] * 1000 + process.hrtime(req._startAt)[1] / 1000000).toFixed(2) : 'unknown'
    };
    
    logger.info('HTTP Response', responseData);
    originalSend.call(this, data);
  };
  
  next();
};

// Error logging middleware
const errorLogger = (err, req, res, next) => {
  const errorData = {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    statusCode: err.statusCode || 500,
    timestamp: new Date().toISOString(),
    environment: req.environment || 'unknown',
    apiKey: req.apiKey ? req.apiKey.substring(0, 8) + '...' : 'none'
  };
  
  logger.error('Error occurred', errorData);
  next(err);
};

module.exports = {
  logger,
  requestLogger,
  responseLogger,
  errorLogger
};
