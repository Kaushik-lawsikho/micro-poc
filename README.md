# Microservices POC with React Frontend

This project demonstrates a comprehensive microservices architecture with a React frontend that integrates seamlessly with multiple backend microservices using an API Gateway. The system includes enterprise-level features like authentication, throttling, logging, and a modern React frontend with Redux Toolkit for state management.

## 🚀 Features Implemented

### 1. **React Frontend**
- **Modern UI**: React 18 with TypeScript for type safety
- **State Management**: Redux Toolkit for centralized state management
- **Modular Components**: Separate pages for Users and Orders domains
- **Error Handling**: Comprehensive error handling with retry logic
- **Loading States**: User-friendly loading indicators
- **Responsive Design**: Mobile-first responsive design
- **API Integration**: Seamless integration with microservices via API Gateway

### 2. **API Gateway Basics**
- **Centralized Routing**: Single entry point for all microservices
- **Service Discovery**: Automatic routing to appropriate backend services
- **Load Balancing**: Ready for horizontal scaling

### 3. **HTTP API with Mock Responses**
- **Mock Endpoints**: `/mock/users`, `/mock/products` for learning and testing
- **CRUD Operations**: Demonstrate GET, POST operations with mock data
- **Response Formatting**: Consistent JSON response structure

### 4. **Backend Integration**
- **Proxy Middleware**: Seamless integration with Users and Orders services
- **Error Handling**: Graceful fallback when services are unavailable
- **Header Propagation**: Forward authentication and tracking headers

### 5. **API Key Authentication**
- **Security Layer**: Protect sensitive endpoints with API keys
- **Environment-based Keys**: Different keys for dev/prod environments
- **Header Support**: `x-api-key` or `Authorization: Bearer <key>`

### 6. **Throttling & Rate Limiting**
- **Global Rate Limiting**: 100 requests per 15 minutes per IP
- **Endpoint-specific Limits**: Customizable limits for different routes
- **Authentication Rate Limiting**: Stricter limits for auth endpoints

### 7. **Request/Response Mapping**
- **Request Transformation**: Add metadata, request IDs, timestamps
- **Response Transformation**: Standardize response format with metadata
- **Data Validation**: Basic request validation middleware

### 8. **Logging Features**
- **Request Logging**: Comprehensive request tracking with Morgan
- **Response Logging**: Response time, size, and status tracking
- **Error Logging**: Detailed error logging with Winston
- **File Logging**: Persistent logs in `logs/` directory

### 9. **Environment Stages**
- **Development Mode**: Enhanced logging, detailed error messages
- **Production Mode**: Optimized performance, minimal logging
- **Configuration Management**: Environment-specific settings

### 10. **Health Monitoring**
- **Service Health Checks**: Monitor gateway and microservice health
- **Readiness Probes**: Check if services are ready to accept requests
- **Liveness Probes**: Verify service process health

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  React Frontend │───▶│  API Gateway    │───▶│  Microservices  │
│                 │    │                 │    │                 │
│ • Redux Toolkit │    │ • Auth          │    │ • Users Service │
│ • TypeScript    │    │ • Throttling    │    │ • Orders Service│
│ • Components    │    │ • Logging       │    │                 │
│ • Error Handling│    │ • Transformation│    └─────────────────┘
└─────────────────┘    │ • Health Checks │
                       └─────────────────┘
```

## 📁 Project Structure

```
microservices-poc/
├── frontend/                    # React Frontend Application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API services
│   │   ├── store/              # Redux store
│   │   ├── types/              # TypeScript types
│   │   └── App.tsx             # Main app component
│   ├── package.json            # Frontend dependencies
│   └── README.md              # Frontend documentation
├── api-gateway/                 # Main API Gateway
│   ├── config.js               # Configuration management
│   ├── index.js                # Main gateway server
│   ├── middleware/             # Custom middleware
│   │   ├── auth.js            # API key authentication
│   │   ├── throttling.js      # Rate limiting
│   │   ├── logging.js         # Request/response logging
│   │   └── transformation.js  # Data transformation
│   ├── routes/                 # Route definitions
│   │   ├── mockRoutes.js      # Mock API endpoints
│   │   └── healthRoutes.js    # Health monitoring
│   ├── logs/                   # Log files
│   └── package.json           # Dependencies
├── users-service/              # Users microservice
├── orders-service/             # Orders microservice
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Install Frontend dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Install API Gateway dependencies:**
   ```bash
   cd ../api-gateway
   npm install
   ```

3. **Install Users Service dependencies:**
   ```bash
   cd ../users-service
   npm install
   ```

4. **Install Orders Service dependencies:**
   ```bash
   cd ../orders-service
   npm install
   ```

### Running the Services

1. **Start Users Service:**
   ```bash
   cd users-service
   npm start
   # Service runs on http://localhost:4001
   ```

2. **Start Orders Service:**
   ```bash
   cd orders-service
   npm start
   # Service runs on http://localhost:4002
   ```

3. **Start API Gateway:**
   ```bash
   cd api-gateway
   npm run dev    # Development mode
   # or
   npm run prod   # Production mode
   # Gateway runs on http://localhost:4000
   ```

4. **Start React Frontend:**
   ```bash
   cd frontend
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

## 🔑 API Keys

### Development Environment
- **API Key**: `dev-api-key-12345`
- **Header**: `x-api-key: dev-api-key-12345`

### Production Environment
- **API Key**: `prod-api-key-67890`
- **Header**: `x-api-key: prod-api-key-67890`

## 📡 API Endpoints

### Public Endpoints (No Authentication Required)
- `GET /` - Gateway information
- `GET /docs` - API documentation
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health check
- `GET /health/ready` - Readiness check
- `GET /health/live` - Liveness check
- `GET /mock/*` - Mock API endpoints

### Protected Endpoints (Authentication Required)
- `GET /users/*` - Users service endpoints
- `POST /users/*` - Users service endpoints
- `GET /orders/*` - Orders service endpoints
- `POST /orders/*` - Orders service endpoints

## 🧪 Testing the API

### 1. **Test Public Endpoints**
```bash
# Get gateway info
curl http://localhost:4000/

# Get documentation
curl http://localhost:4000/docs

# Health check
curl http://localhost:4000/health

# Mock users
curl http://localhost:4000/mock/users
```

### 2. **Test Protected Endpoints**
```bash
# Get users (with API key)
curl -H "x-api-key: dev-api-key-12345" http://localhost:4000/users

# Get orders (with API key)
curl -H "x-api-key: dev-api-key-12345" http://localhost:4000/orders
```

### 3. **Test Rate Limiting**
```bash
# Make multiple requests quickly to see rate limiting
for i in {1..110}; do
  curl -H "x-api-key: dev-api-key-12345" http://localhost:4000/users
  echo "Request $i"
done
```

## 📊 Monitoring & Logs

### Log Files
- **Combined Logs**: `api-gateway/logs/combined.log`
- **Error Logs**: `api-gateway/logs/error.log`
- **Console Output**: Real-time logging in terminal

### Health Monitoring
- **Gateway Health**: `http://localhost:4000/health`
- **Service Status**: `http://localhost:4000/health/detailed`
- **Service Health**: 
  - Users: `http://localhost:4001/health`
  - Orders: `http://localhost:4002/health`

## 🔧 Configuration

### Environment Variables
- `NODE_ENV`: Environment (development/production)
- `PORT`: Gateway port (default: 4000)
- `LOG_LEVEL`: Logging level (default: info)

### Rate Limiting
- **Global**: 100 requests per 15 minutes per IP
- **Auth Endpoints**: 5 requests per 15 minutes per IP

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production
```bash
npm run prod
```

### Docker (Future Enhancement)
```bash
docker build -t api-gateway .
docker run -p 4000:4000 api-gateway
```

## 📚 Learning Outcomes

This project demonstrates:

1. **API Gateway Patterns**: Centralized routing, authentication, and monitoring
2. **Security Implementation**: API key authentication and rate limiting
3. **Observability**: Comprehensive logging and health monitoring
4. **Request/Response Handling**: Transformation and validation middleware
5. **Microservices Integration**: Proxy routing with error handling
6. **Environment Management**: Development vs production configurations
7. **Error Handling**: Graceful degradation and user-friendly error messages

## 🔮 Future Enhancements

- **JWT Authentication**: More secure token-based authentication
- **OAuth Integration**: Third-party authentication providers
- **API Versioning**: Support for multiple API versions
- **Circuit Breaker**: Fault tolerance patterns
- **Metrics Collection**: Prometheus/Grafana integration
- **Load Balancing**: Multiple instance support
- **SSL/TLS**: HTTPS encryption
- **API Documentation**: Swagger/OpenAPI integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed.

---

**Happy Coding! 🎉**
