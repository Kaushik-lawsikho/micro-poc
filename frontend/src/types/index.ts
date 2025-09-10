// Type definitions for the microservices frontend

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Order {
  id: number;
  product: string;
  amount: number;
  userId: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  count?: number;
}

export interface ApiError {
  success: false;
  error: string;
  message: string;
  details?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface UsersState extends LoadingState {
  users: User[];
  selectedUser: User | null;
}

export interface OrdersState extends LoadingState {
  orders: Order[];
  selectedOrder: Order | null;
}


export interface RootState {
  users: UsersState;
  orders: OrdersState;
}

// API Configuration
export interface ApiConfig {
  baseURL: string;
  apiKey: string;
  timeout: number;
}

// Service endpoints
export const API_ENDPOINTS = {
  USERS: {
    BASE: '/users',
    BY_ID: (id: number) => `/users/${id}`,
  },
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id: number) => `/orders/${id}`,
  },
  MOCK: {
    USERS: '/mock/users',
    PRODUCTS: '/mock/products',
  },
} as const;
