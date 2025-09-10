// Users service for API integration
import { apiService } from './api';
import type { User, ApiResponse } from '../types';
import { API_ENDPOINTS } from '../types';

export class UsersService {
  // Get all users
  static async getUsers(): Promise<ApiResponse<User[]>> {
    try {
      return await apiService.get<User[]>(API_ENDPOINTS.USERS.BASE);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }

  // Get user by ID
  static async getUserById(id: number): Promise<ApiResponse<User>> {
    try {
      return await apiService.get<User>(API_ENDPOINTS.USERS.BY_ID(id));
    } catch (error) {
      console.error(`Failed to fetch user ${id}:`, error);
      throw error;
    }
  }

  // Create new user
  static async createUser(userData: Omit<User, 'id'>): Promise<ApiResponse<User>> {
    try {
      return await apiService.post<User>(API_ENDPOINTS.USERS.BASE, userData);
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }

  // Update user
  static async updateUser(id: number, userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      return await apiService.put<User>(API_ENDPOINTS.USERS.BY_ID(id), userData);
    } catch (error) {
      console.error(`Failed to update user ${id}:`, error);
      throw error;
    }
  }

  // Delete user
  static async deleteUser(id: number): Promise<ApiResponse<void>> {
    try {
      return await apiService.delete<void>(API_ENDPOINTS.USERS.BY_ID(id));
    } catch (error) {
      console.error(`Failed to delete user ${id}:`, error);
      throw error;
    }
  }

  // Get mock users (for testing without authentication)
  static async getMockUsers(): Promise<ApiResponse<User[]>> {
    try {
      return await apiService.get<User[]>(API_ENDPOINTS.MOCK.USERS);
    } catch (error) {
      console.error('Failed to fetch mock users:', error);
      throw error;
    }
  }
}

export default UsersService;
