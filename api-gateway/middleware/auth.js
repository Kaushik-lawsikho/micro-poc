// API Key Authentication Middleware
const config = require('../config');

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
  
  // Add environment info to request for logging/debugging
  req.environment = config.NODE_ENV;
  req.apiKey = apiKey;
  
  next();
};

module.exports = { authenticateApiKey };
