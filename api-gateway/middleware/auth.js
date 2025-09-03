// API Key Authentication Middleware
const config = require('../config');

const authenticateApiKey = (req, res, next) => {
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
  
  // Add environment info to request for logging/debugging
  req.environment = config.NODE_ENV;
  req.apiKey = apiKey;
  
  next();
};

module.exports = { authenticateApiKey };
