import { api } from './config';
import type { ApiResponse, Alert, AlertStats } from './types';

export const alertsApi = {
  /**
   * Get all alerts with optional filtering
   */
  getAlerts: async (params?: {
    page?: number;
    limit?: number;
    type?: string;
    region?: string;
    severity?: string;
    active?: string;
  }): Promise<ApiResponse<Alert[]>> => {
    const response = await api.get<ApiResponse<Alert[]>>('/api/alerts', { params });
    return response.data;
  },

  /**
   * Get active alerts
   */
  getActiveAlerts: async (params?: {
    region?: string;
  }): Promise<ApiResponse<Alert[]>> => {
    const response = await api.get<ApiResponse<Alert[]>>('/api/alerts/active', { params });
    return response.data;
  },

  /**
   * Get alert by ID
   */
  getAlertById: async (id: string): Promise<ApiResponse<Alert>> => {
    const response = await api.get<ApiResponse<Alert>>(`/api/alerts/${id}`);
    return response.data;
  },

  /**
   * Create new alert
   */
  createAlert: async (alertData: {
    type: string;
    title: string;
    message: string;
    region: string;
    severity: string;
    expiresAt?: string;
    actionRequired?: string;
    contactInfo?: {
      emergencyNumber?: string;
      helplineNumber?: string;
      email?: string;
      website?: string;
    };
  }): Promise<ApiResponse<Alert>> => {
    const response = await api.post<ApiResponse<Alert>>('/api/alerts', alertData);
    return response.data;
  },

  /**
   * Update alert
   */
  updateAlert: async (id: string, alertData: Partial<Alert>): Promise<ApiResponse<Alert>> => {
    const response = await api.put<ApiResponse<Alert>>(`/api/alerts/${id}`, alertData);
    return response.data;
  },

  /**
   * Delete alert
   */
  deleteAlert: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/api/alerts/${id}`);
    return response.data;
  },

  /**
   * Deactivate alert
   */
  deactivateAlert: async (id: string): Promise<ApiResponse<Alert>> => {
    const response = await api.patch<ApiResponse<Alert>>(`/api/alerts/${id}/deactivate`);
    return response.data;
  },

  /**
   * Get alert statistics
   */
  getAlertStats: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<AlertStats>> => {
    const response = await api.get<ApiResponse<AlertStats>>('/api/alerts/stats/overview', { params });
    return response.data;
  },

  /**
   * Get alert types
   */
  getAlertTypes: () => {
    return [
      { value: 'earthquake', label: 'Earthquake', color: '#B45309', icon: '🌍' },
      { value: 'flood', label: 'Flood', color: '#3B82F6', icon: '🌊' },
      { value: 'fire', label: 'Fire', color: '#EF4444', icon: '🔥' },
      { value: 'storm', label: 'Storm', color: '#6B7280', icon: '⛈️' },
      { value: 'tsunami', label: 'Tsunami', color: '#1E40AF', icon: '🌊' },
      { value: 'landslide', label: 'Landslide', color: '#92400E', icon: '⛰️' },
      { value: 'cyclone', label: 'Cyclone', color: '#7C3AED', icon: '🌀' },
      { value: 'drought', label: 'Drought', color: '#D97706', icon: '🌵' },
      { value: 'general', label: 'General Emergency', color: '#374151', icon: '⚠️' },
    ];
  },

  /**
   * Get severity levels
   */
  getSeverityLevels: () => {
    return [
      { value: 'low', label: 'Low', color: '#10B981', bgColor: '#D1FAE5' },
      { value: 'medium', label: 'Medium', color: '#F59E0B', bgColor: '#FEF3C7' },
      { value: 'high', label: 'High', color: '#EF4444', bgColor: '#FEE2E2' },
      { value: 'critical', label: 'Critical', color: '#991B1B', bgColor: '#FEE2E2' },
    ];
  },

  /**
   * Get alerts for a specific region
   */
  getAlertsByRegion: async (region: string): Promise<ApiResponse<Alert[]>> => {
    const response = await api.get<ApiResponse<Alert[]>>('/api/alerts/active', { 
      params: { region } 
    });
    return response.data;
  },

  /**
   * Extend alert expiration
   */
  extendAlert: async (id: string, hours: number = 24): Promise<ApiResponse<Alert>> => {
    const response = await api.patch<ApiResponse<Alert>>(`/api/alerts/${id}/extend`, { hours });
    return response.data;
  },

  /**
   * Acknowledge alert
   */
  acknowledgeAlert: async (id: string, notes?: string): Promise<ApiResponse<Alert>> => {
    const response = await api.patch<ApiResponse<Alert>>(`/api/alerts/${id}/acknowledge`, { notes });
    return response.data;
  },

  /**
   * Get priority levels
   */
  getPriorityLevels: () => {
    return [
      { value: 1, label: 'Very Low' },
      { value: 2, label: 'Low' },
      { value: 3, label: 'Below Normal' },
      { value: 4, label: 'Normal' },
      { value: 5, label: 'Default' },
      { value: 6, label: 'Above Normal' },
      { value: 7, label: 'High' },
      { value: 8, label: 'Very High' },
      { value: 9, label: 'Critical' },
      { value: 10, label: 'Emergency' },
    ];
  },

  /**
   * Format alert time
   */
  formatAlertTime: (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  },
};

export default alertsApi;