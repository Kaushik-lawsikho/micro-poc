// Orders service for API integration
import { apiService } from './api';
import type { Order, ApiResponse } from '../types';
import { API_ENDPOINTS } from '../types';

export class OrdersService {
  // Get all orders
  static async getOrders(): Promise<ApiResponse<Order[]>> {
    try {
      return await apiService.get<Order[]>(API_ENDPOINTS.ORDERS.BASE);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  }

  // Get order by ID
  static async getOrderById(id: number): Promise<ApiResponse<Order>> {
    try {
      return await apiService.get<Order>(API_ENDPOINTS.ORDERS.BY_ID(id));
    } catch (error) {
      console.error(`Failed to fetch order ${id}:`, error);
      throw error;
    }
  }

  // Create new order
  static async createOrder(orderData: Omit<Order, 'id'>): Promise<ApiResponse<Order>> {
    try {
      return await apiService.post<Order>(API_ENDPOINTS.ORDERS.BASE, orderData);
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }

  // Update order
  static async updateOrder(id: number, orderData: Partial<Order>): Promise<ApiResponse<Order>> {
    try {
      return await apiService.put<Order>(API_ENDPOINTS.ORDERS.BY_ID(id), orderData);
    } catch (error) {
      console.error(`Failed to update order ${id}:`, error);
      throw error;
    }
  }

  // Delete order
  static async deleteOrder(id: number): Promise<ApiResponse<void>> {
    try {
      return await apiService.delete<void>(API_ENDPOINTS.ORDERS.BY_ID(id));
    } catch (error) {
      console.error(`Failed to delete order ${id}:`, error);
      throw error;
    }
  }

  // Get orders by user ID
  static async getOrdersByUserId(userId: number): Promise<ApiResponse<Order[]>> {
    try {
      return await apiService.get<Order[]>(`${API_ENDPOINTS.ORDERS.BASE}?userId=${userId}`);
    } catch (error) {
      console.error(`Failed to fetch orders for user ${userId}:`, error);
      throw error;
    }
  }
}

export default OrdersService;
