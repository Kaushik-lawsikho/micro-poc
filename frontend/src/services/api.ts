// API service configuration and base client
import axios from 'axios';
import type { ApiResponse, ApiError, ApiConfig } from '../types';

class ApiService {
  private baseURL: string;
  private apiKey: string;
  private timeout: number;

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL;
    this.apiKey = config.apiKey;
    this.timeout = config.timeout;
  }

  // Generic request method with retry logic
  async request<T>(method: string, url: string, data?: any, retries = 3): Promise<ApiResponse<T>> {
    let lastError: any;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🚀 API Request: ${method.toUpperCase()} ${url}`);
        
        const response = await axios({
          method,
          url: `${this.baseURL}${url}`,
          data,
          timeout: this.timeout,
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
          },
        });

        console.log(`✅ API Response: ${response.status} ${url}`);
        console.log('Response data:', response.data);
        return response.data;
      } catch (error: any) {
        lastError = error;
        console.error(`❌ API Error (attempt ${attempt}):`, error.response?.status, error.message);
        
        if (attempt < retries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          console.log(`🔄 Retry attempt ${attempt}/${retries} in ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // Transform error response
    const apiError: ApiError = {
      success: false,
      error: lastError.response?.data?.error || 'Network Error',
      message: lastError.response?.data?.message || lastError.message,
      details: lastError.response?.data?.details,
    };
    
    throw apiError;
  }

  // HTTP Methods
  async get<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>('GET', url);
  }

  async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', url, data);
  }

  async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', url, data);
  }

  async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', url);
  }
}

// Create API service instance
const apiConfig: ApiConfig = {
  baseURL: 'http://localhost:4000', // API Gateway URL
  apiKey: 'dev-api-key-12345', // Development API key
  timeout: 10000, // 10 seconds
};

export const apiService = new ApiService(apiConfig);
export default apiService;