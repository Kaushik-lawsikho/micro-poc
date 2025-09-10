// Configuration file for API Gateway
const config = {
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 4000,
  
  // API Keys (in production, these should be stored securely)
  API_KEYS: {
    development: 'dev-api-key-12345',
    production: 'prod-api-key-67890'
  },
  
  // Rate Limiting
  RATE_LIMIT: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
  },
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // Service URLs
  SERVICES: {
    users: process.env.USERS_SERVICE_URL || 'http://localhost:4001',
    orders: process.env.ORDERS_SERVICE_URL || 'http://localhost:4002'
  },
  
  // CORS
  CORS: {
    origin: process.env.NODE_ENV === 'production' 
      ? ['https://yourdomain.com'] 
      : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'],
    credentials: true
  }
};

module.exports = config;
