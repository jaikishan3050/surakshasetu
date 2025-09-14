// Common API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{
    msg: string;
    param?: string;
    location?: string;
  }>;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// User and Authentication
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'super_admin';
  lastLogin?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

// Student
export interface Student {
  id: string;
  name: string;
  class: string;
  rollNo: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
    notes?: string;
  };
  isActive: boolean;
  enrollmentDate: string;
  lastDrillDate?: string;
  totalDrills: number;
  averageScore?: number;
  displayName?: string;
  createdAt: string;
  updatedAt: string;
}

// Drill
export interface DrillResponse {
  questionId: string;
  question: string;
  answer: any;
  correctAnswer: any;
  isCorrect: boolean;
  timeSpent?: number;
}

export interface Drill {
  id: string;
  studentId: string;
  drillType: 'fire' | 'earthquake' | 'flood' | 'general_emergency' | 'evacuation' | 'storm' | 'lockdown';
  score?: number;
  status: 'completed' | 'in_progress' | 'failed' | 'skipped' | 'abandoned';
  duration?: number;
  startedAt: string;
  completedAt?: string;
  responses?: DrillResponse[];
  correctAnswers: number;
  totalQuestions: number;
  notes?: string;
  feedback?: string;
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  environmentConditions?: {
    weather?: string;
    time?: 'morning' | 'afternoon' | 'evening' | 'night';
    location?: string;
  };
  supervisorNotes?: string;
  accuracy?: number;
  performanceRating?: string;
  createdAt: string;
  updatedAt: string;
}

// Alert
export interface Alert {
  id: string;
  type: 'earthquake' | 'flood' | 'fire' | 'storm' | 'tsunami' | 'landslide' | 'general' | 'cyclone' | 'drought';
  title: string;
  message: string;
  region: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  active: boolean;
  expiresAt: string;
  actionRequired?: string;
  contactInfo?: {
    emergencyNumber?: string;
    helplineNumber?: string;
    email?: string;
    website?: string;
  };
  source?: {
    organization?: string;
    authorityLevel?: 'local' | 'regional' | 'state' | 'national' | 'international';
    verificationStatus?: 'verified' | 'pending' | 'unverified';
  };
  affectedAreas?: string[];
  coordinates?: {
    latitude?: number;
    longitude?: number;
    radius?: number;
  };
  tags?: string[];
  priority: number;
  viewCount: number;
  isExpired?: boolean;
  timeToExpiry?: string;
  severityColor?: string;
  createdAt: string;
  updatedAt: string;
}

// News
export interface News {
  id: string;
  title: string;
  description: string;
  source: string;
  sourceUrl?: string;
  category: 'earthquake' | 'flood' | 'fire' | 'storm' | 'tsunami' | 'landslide' | 'general' | 'preparedness' | 'recovery' | 'cyclone' | 'drought' | 'emergency_response' | 'infrastructure' | 'weather_alert';
  region?: string;
  imageUrl?: string;
  publishedAt: string;
  tags?: string[];
  severity?: 'low' | 'medium' | 'high' | 'critical';
  views: number;
  likes: number;
  shares: number;
  isVerified: boolean;
  isFeatured: boolean;
  content?: {
    summary?: string;
    fullText?: string;
    keyPoints?: string[];
    actionItems?: string[];
  };
  location?: {
    coordinates?: {
      latitude?: number;
      longitude?: number;
    };
    address?: string;
  };
  author?: {
    name?: string;
    organization?: string;
    contact?: string;
  };
  readingTime?: string;
  newsAge?: string;
  engagementScore?: number;
  averageRating?: number;
  createdAt: string;
  updatedAt: string;
}

// Statistics and Analytics
export interface DrillStats {
  totalDrills: number;
  drillsByType: Array<{
    _id: string;
    count: number;
    avgScore?: number;
  }>;
  drillsByStatus: Array<{
    _id: string;
    count: number;
  }>;
  avgScores: Array<{
    _id: string;
    avgScore: number;
    maxScore: number;
    minScore: number;
  }>;
  recentActivity: Array<{
    _id: {
      year: number;
      month: number;
      day: number;
    };
    count: number;
  }>;
}

export interface AlertStats {
  totalAlerts: number;
  activeAlerts: number;
  alertsByType: Array<{
    _id: string;
    count: number;
  }>;
  alertsBySeverity: Array<{
    _id: string;
    count: number;
  }>;
  alertsByRegion: Array<{
    _id: string;
    count: number;
  }>;
}

export interface StudentStats {
  totalStudents: number;
  studentsByClass: Array<{
    _id: string;
    count: number;
  }>;
}

export interface NewsStats {
  totalNews: number;
  recentNews: number;
  newsByCategory: Array<{
    _id: string;
    count: number;
    totalViews: number;
  }>;
  newsBySource: Array<{
    _id: string;
    count: number;
  }>;
  topViewed: Array<{
    _id: string;
    title: string;
    views: number;
    publishedAt: string;
    category: string;
  }>;
}