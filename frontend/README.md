# Microservices Frontend

A React-based frontend application that integrates with microservices architecture using Redux Toolkit for state management.

## Features

- **Modular Architecture**: Separate components for Users and Orders domains
- **Redux Toolkit**: Centralized state management with RTK Query for API calls
- **TypeScript**: Full type safety throughout the application
- **Error Handling**: Comprehensive error handling with retry logic
- **Loading States**: User-friendly loading indicators
- **Responsive Design**: Mobile-first responsive design
- **API Integration**: Seamless integration with microservices via API Gateway

## Tech Stack

- React 18 with TypeScript
- Redux Toolkit for state management
- Axios for HTTP requests
- Vite for build tooling
- CSS3 for styling

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Running microservices (API Gateway, Users Service, Orders Service)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Environment Setup

The application is configured to connect to:
- API Gateway: `http://localhost:4000`
- API Key: `dev-api-key-12345` (development)

## Project Structure

```
src/
├── components/          # React components
│   ├── UsersPage.tsx   # Users management page
│   ├── OrdersPage.tsx  # Orders management page
│   ├── UserCard.tsx    # User card component
│   ├── OrderCard.tsx   # Order card component
│   ├── UserForm.tsx    # User form component
│   ├── OrderForm.tsx   # Order form component
│   ├── LoadingSpinner.tsx
│   └── ErrorAlert.tsx
├── hooks/              # Custom React hooks
│   ├── useUsers.ts     # Users management hook
│   ├── useOrders.ts    # Orders management hook
│   └── useRedux.ts     # Typed Redux hooks
├── services/           # API services
│   ├── api.ts          # Base API client
│   ├── usersService.ts # Users API service
│   └── ordersService.ts # Orders API service
├── store/              # Redux store
│   ├── index.ts        # Store configuration
│   ├── usersSlice.ts   # Users Redux slice
│   └── ordersSlice.ts  # Orders Redux slice
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types
└── App.tsx             # Main application component
```

## API Integration

The frontend integrates with microservices through:

1. **API Gateway** (`http://localhost:4000`): Main entry point
2. **Users Service** (`http://localhost:4001`): User management
3. **Orders Service** (`http://localhost:4002`): Order management

### Authentication

All API requests include the API key in the `x-api-key` header:
```
x-api-key: dev-api-key-12345
```

### Error Handling

- Automatic retry logic with exponential backoff
- User-friendly error messages
- Network error handling
- Service unavailable handling

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Demonstrated

1. **Modular Components**: Separate pages for Users and Orders
2. **State Management**: Redux Toolkit with typed hooks
3. **API Integration**: Axios-based services with retry logic
4. **Error Handling**: Comprehensive error states and user feedback
5. **Loading States**: Loading indicators for better UX
6. **Form Management**: Create and edit forms with validation
7. **Responsive Design**: Mobile-friendly interface

## Integration with Microservices

The frontend demonstrates the Backend-for-Frontend (BFF) pattern by:

- Using the API Gateway as a single entry point
- Handling authentication at the gateway level
- Aggregating data from multiple microservices
- Providing a unified interface for the frontend

## Development Notes

- All API calls go through the API Gateway
- Error handling includes retry logic for failed requests
- State management is centralized using Redux Toolkit
- Components are modular and reusable
- TypeScript provides full type safety