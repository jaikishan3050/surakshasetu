import { api } from './config';
import type { ApiResponse, LoginRequest, LoginResponse, User } from './types';

export const authApi = {
  /**
   * Admin login
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/api/auth/login', credentials);
    return response.data;
  },

  /**
   * Register new admin user (for development)
   */
  register: async (userData: {
    username: string;
    password: string;
    role?: 'admin' | 'super_admin';
  }): Promise<ApiResponse<User>> => {
    const response = await api.post<ApiResponse<User>>('/api/auth/register', userData);
    return response.data;
  },

  /**
   * Verify JWT token
   */
  verifyToken: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>('/api/auth/verify');
    return response.data;
  },

  /**
   * Logout (client-side token removal)
   */
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('authToken');
    return !!token;
  },

  /**
   * Get current user from localStorage
   */
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr) as User;
    } catch {
      return null;
    }
  },

  /**
   * Store authentication data
   */
  storeAuthData: (token: string, user: User) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
};

export default authApi;