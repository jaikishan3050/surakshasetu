import { api } from './config';
import type { ApiResponse, Drill, DrillStats } from './types';

export const drillsApi = {
  /**
   * Get all drills with optional filtering
   */
  getDrills: async (params?: {
    page?: number;
    limit?: number;
    studentId?: string;
    drillType?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<Drill[]>> => {
    const response = await api.get<ApiResponse<Drill[]>>('/api/drills', { params });
    return response.data;
  },

  /**
   * Get drill by ID
   */
  getDrillById: async (id: string): Promise<ApiResponse<Drill>> => {
    const response = await api.get<ApiResponse<Drill>>(`/api/drills/${id}`);
    return response.data;
  },

  /**
   * Create new drill completion record
   */
  createDrill: async (drillData: {
    studentId: string;
    drillType: string;
    score?: number;
    status: string;
    duration?: number;
    notes?: string;
    responses?: any[];
  }): Promise<ApiResponse<Drill>> => {
    const response = await api.post<ApiResponse<Drill>>('/api/drills', drillData);
    return response.data;
  },

  /**
   * Update drill record
   */
  updateDrill: async (id: string, drillData: Partial<Drill>): Promise<ApiResponse<Drill>> => {
    const response = await api.put<ApiResponse<Drill>>(`/api/drills/${id}`, drillData);
    return response.data;
  },

  /**
   * Delete drill record
   */
  deleteDrill: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/api/drills/${id}`);
    return response.data;
  },

  /**
   * Get drill statistics and analytics
   */
  getDrillStats: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<DrillStats>> => {
    const response = await api.get<ApiResponse<DrillStats>>('/api/drills/stats/overview', { params });
    return response.data;
  },

  /**
   * Get drills for a specific student
   */
  getStudentDrills: async (studentId: string, params?: {
    page?: number;
    limit?: number;
    drillType?: string;
  }): Promise<ApiResponse<Drill[]>> => {
    const response = await api.get<ApiResponse<Drill[]>>(`/api/drills/student/${studentId}`, { params });
    return response.data;
  },

  /**
   * Submit drill answers
   */
  submitDrillAnswers: async (drillId: string, answers: {
    questionId: string;
    answer: any;
    timeSpent?: number;
  }[]): Promise<ApiResponse<Drill>> => {
    const response = await api.post<ApiResponse<Drill>>(`/api/drills/${drillId}/submit`, { answers });
    return response.data;
  },

  /**
   * Mark drill as completed
   */
  completeDrill: async (drillId: string, finalScore?: number): Promise<ApiResponse<Drill>> => {
    const response = await api.patch<ApiResponse<Drill>>(`/api/drills/${drillId}/complete`, { 
      finalScore 
    });
    return response.data;
  },

  /**
   * Get drill types
   */
  getDrillTypes: () => {
    return [
      { value: 'fire', label: 'Fire Drill', color: '#EF4444' },
      { value: 'earthquake', label: 'Earthquake Drill', color: '#B45309' },
      { value: 'flood', label: 'Flood Drill', color: '#3B82F6' },
      { value: 'general_emergency', label: 'General Emergency', color: '#6B7280' },
      { value: 'evacuation', label: 'Evacuation Drill', color: '#059669' },
      { value: 'storm', label: 'Storm Drill', color: '#7C2D12' },
      { value: 'lockdown', label: 'Lockdown Drill', color: '#7C3AED' },
    ];
  },

  /**
   * Get drill statuses
   */
  getDrillStatuses: () => {
    return [
      { value: 'completed', label: 'Completed', color: '#10B981' },
      { value: 'in_progress', label: 'In Progress', color: '#F59E0B' },
      { value: 'failed', label: 'Failed', color: '#EF4444' },
      { value: 'skipped', label: 'Skipped', color: '#6B7280' },
      { value: 'abandoned', label: 'Abandoned', color: '#991B1B' },
    ];
  },
};

export default drillsApi;