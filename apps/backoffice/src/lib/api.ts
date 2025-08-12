// API client for Prisma v5 Backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3004';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
}

export interface Presentation {
  id: string;
  title: string;
  description: string;
  status: 'DRAFT' | 'PUBLISHED';
  accessToken: string;
  content: {
    slides: Array<{
      id: string;
      type: string;
      title: string;
      content?: string;
    }>;
  };
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface AnalyticsEvent {
  id: string;
  presentationId: string;
  sessionId: string;
  eventType: 'PRESENTATION_START' | 'SLIDE_VIEW' | 'CHAT_INTERACTION' | 'VOICE_INTERACTION';
  eventData: Record<string, any>;
  timestamp: string;
  userAgent: string;
  ipAddress: string;
}

export interface AnalyticsSummary {
  totalEvents: number;
  totalSessions: number;
  engagementRate: number;
  topPresentations: Array<{
    id: string;
    title: string;
    views: number;
    interactions: number;
  }>;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log('API Request:', { url, method: options.method || 'GET' });
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });
      
      console.log('API Response:', { status: response.status, ok: response.ok });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Network error' }));
        console.error('API Error:', error);
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('API Success:', data);
      return data;
    } catch (fetchError) {
      console.error('Fetch Error:', fetchError);
      throw fetchError;
    }
  }

  // Authentication
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const result = await this.request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    this.token = result.token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', result.token);
    }

    return result;
  }

  async logout(): Promise<void> {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  async getProfile(): Promise<User> {
    return this.request<User>('/api/auth/me');
  }

  // Presentations
  async getPresentations(): Promise<Presentation[]> {
    return this.request<Presentation[]>('/api/presentations');
  }

  async getPresentation(id: string): Promise<Presentation> {
    return this.request<Presentation>(`/api/presentations/${id}`);
  }

  async createPresentation(data: {
    title: string;
    description: string;
    content: any;
  }): Promise<Presentation> {
    return this.request<Presentation>('/api/presentations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePresentation(id: string, data: Partial<Presentation>): Promise<Presentation> {
    return this.request<Presentation>(`/api/presentations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePresentation(id: string): Promise<void> {
    await this.request(`/api/presentations/${id}`, {
      method: 'DELETE',
    });
  }

  async duplicatePresentation(id: string): Promise<Presentation> {
    return this.request<Presentation>(`/api/presentations/${id}/duplicate`, {
      method: 'POST',
    });
  }

  // Analytics
  async trackEvent(data: {
    presentationId: string;
    eventType: string;
    sessionId: string;
    metadata?: Record<string, any>;
  }): Promise<{ success: boolean; eventId: string }> {
    return this.request<{ success: boolean; eventId: string }>('/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getAnalyticsSummary(): Promise<AnalyticsSummary> {
    return this.request<AnalyticsSummary>('/api/analytics/summary');
  }

  async getPresentationAnalytics(id: string): Promise<{
    presentationId: string;
    totalViews: number;
    totalInteractions: number;
    uniqueSessions: number;
    averageDuration: number;
    events: AnalyticsEvent[];
  }> {
    return this.request(`/api/analytics/presentation/${id}`);
  }

  // Health check
  async healthCheck(): Promise<{
    status: string;
    service: string;
    timestamp: string;
    storage: string;
  }> {
    return this.request<{
      status: string;
      service: string;
      timestamp: string;
      storage: string;
    }>('/health');
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const apiClient = new ApiClient();
