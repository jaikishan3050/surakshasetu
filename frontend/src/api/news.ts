import { api } from './config';
import type { ApiResponse, News, NewsStats } from './types';

export const newsApi = {
  /**
   * Get all news with optional filtering
   */
  getNews: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    region?: string;
    search?: string;
  }): Promise<ApiResponse<News[]>> => {
    const response = await api.get<ApiResponse<News[]>>('/api/news', { params });
    return response.data;
  },

  /**
   * Get latest news (top 10)
   */
  getLatestNews: async (params?: {
    category?: string;
    region?: string;
  }): Promise<ApiResponse<News[]>> => {
    const response = await api.get<ApiResponse<News[]>>('/api/news/latest', { params });
    return response.data;
  },

  /**
   * Get news by ID
   */
  getNewsById: async (id: string): Promise<ApiResponse<News>> => {
    const response = await api.get<ApiResponse<News>>(`/api/news/${id}`);
    return response.data;
  },

  /**
   * Create new news article
   */
  createNews: async (newsData: {
    title: string;
    description: string;
    source: string;
    category: string;
    region?: string;
    sourceUrl?: string;
    imageUrl?: string;
    publishedAt?: string;
    tags?: string[];
  }): Promise<ApiResponse<News>> => {
    const response = await api.post<ApiResponse<News>>('/api/news', newsData);
    return response.data;
  },

  /**
   * Update news article
   */
  updateNews: async (id: string, newsData: Partial<News>): Promise<ApiResponse<News>> => {
    const response = await api.put<ApiResponse<News>>(`/api/news/${id}`, newsData);
    return response.data;
  },

  /**
   * Delete news article
   */
  deleteNews: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete<ApiResponse>(`/api/news/${id}`);
    return response.data;
  },

  /**
   * Get news categories
   */
  getNewsCategories: async (): Promise<ApiResponse<string[]>> => {
    const response = await api.get<ApiResponse<string[]>>('/api/news/categories/list');
    return response.data;
  },

  /**
   * Get news statistics
   */
  getNewsStats: async (params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<NewsStats>> => {
    const response = await api.get<ApiResponse<NewsStats>>('/api/news/stats/overview', { params });
    return response.data;
  },

  /**
   * Trigger news scraping
   */
  scrapeNews: async (): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/api/news/scrape');
    return response.data;
  },

  /**
   * Get predefined news categories with metadata
   */
  getCategoryTypes: () => {
    return [
      { value: 'earthquake', label: 'Earthquake', color: '#B45309', icon: '🌍' },
      { value: 'flood', label: 'Flood', color: '#3B82F6', icon: '🌊' },
      { value: 'fire', label: 'Fire', color: '#EF4444', icon: '🔥' },
      { value: 'storm', label: 'Storm', color: '#6B7280', icon: '⛈️' },
      { value: 'tsunami', label: 'Tsunami', color: '#1E40AF', icon: '🌊' },
      { value: 'landslide', label: 'Landslide', color: '#92400E', icon: '⛰️' },
      { value: 'cyclone', label: 'Cyclone', color: '#7C3AED', icon: '🌀' },
      { value: 'drought', label: 'Drought', color: '#D97706', icon: '🌵' },
      { value: 'general', label: 'General News', color: '#374151', icon: '📰' },
      { value: 'preparedness', label: 'Preparedness', color: '#059669', icon: '🛡️' },
      { value: 'recovery', label: 'Recovery', color: '#10B981', icon: '🔄' },
      { value: 'emergency_response', label: 'Emergency Response', color: '#DC2626', icon: '🚨' },
      { value: 'infrastructure', label: 'Infrastructure', color: '#7C2D12', icon: '🏗️' },
      { value: 'weather_alert', label: 'Weather Alert', color: '#F59E0B', icon: '🌤️' },
    ];
  },

  /**
   * Get severity levels for news
   */
  getSeverityLevels: () => {
    return [
      { value: 'low', label: 'Low Priority', color: '#10B981', bgColor: '#D1FAE5' },
      { value: 'medium', label: 'Medium Priority', color: '#F59E0B', bgColor: '#FEF3C7' },
      { value: 'high', label: 'High Priority', color: '#EF4444', bgColor: '#FEE2E2' },
      { value: 'critical', label: 'Critical', color: '#991B1B', bgColor: '#FEE2E2' },
    ];
  },

  /**
   * Increment news views
   */
  incrementViews: async (id: string): Promise<ApiResponse<News>> => {
    const response = await api.patch<ApiResponse<News>>(`/api/news/${id}/view`);
    return response.data;
  },

  /**
   * Like news article
   */
  likeNews: async (id: string): Promise<ApiResponse<News>> => {
    const response = await api.patch<ApiResponse<News>>(`/api/news/${id}/like`);
    return response.data;
  },

  /**
   * Share news article
   */
  shareNews: async (id: string): Promise<ApiResponse<News>> => {
    const response = await api.patch<ApiResponse<News>>(`/api/news/${id}/share`);
    return response.data;
  },

  /**
   * Get trending news
   */
  getTrendingNews: async (params?: {
    limit?: number;
    timeframe?: number;
  }): Promise<ApiResponse<News[]>> => {
    const response = await api.get<ApiResponse<News[]>>('/api/news/trending', { params });
    return response.data;
  },

  /**
   * Search news articles
   */
  searchNews: async (query: string, filters?: {
    category?: string;
    region?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<News[]>> => {
    const response = await api.get<ApiResponse<News[]>>('/api/news/search', {
      params: { q: query, ...filters }
    });
    return response.data;
  },

  /**
   * Get news by category and region
   */
  getNewsByCategory: async (category: string, region?: string, limit: number = 20): Promise<ApiResponse<News[]>> => {
    const response = await api.get<ApiResponse<News[]>>('/api/news/category', {
      params: { category, region, limit }
    });
    return response.data;
  },

  /**
   * Format news publication time
   */
  formatNewsTime: (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffWeeks < 4) return `${diffWeeks}w ago`;
    if (diffMonths < 12) return `${diffMonths}mo ago`;
    return date.toLocaleDateString();
  },

  /**
   * Extract reading time from content
   */
  calculateReadingTime: (content: string): string => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min read`;
  },
};

export default newsApi;