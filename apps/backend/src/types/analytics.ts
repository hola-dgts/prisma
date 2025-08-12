// Analytics types
export interface AnalyticsEvent {
  presentationId: string;
  sessionId?: string;
  eventType: AnalyticsEventType;
  eventData?: any;
  userAgent?: string;
  ipAddress?: string;
}

export type AnalyticsEventType = 
  | 'presentation_view'
  | 'slide_change'
  | 'slide_duration'
  | 'chat_interaction'
  | 'voice_interaction'
  | 'button_click'
  | 'form_submission'
  | 'download'
  | 'share'
  | 'exit';

export interface AnalyticsResponse {
  presentationId: string;
  totalViews: number;
  uniqueViews: number;
  averageTimeSpent: number;
  completionRate: number;
  chatInteractions: number;
  voiceInteractions: number;
  mostViewedSlides: SlideAnalytics[];
  timeSpentPerSlide: SlideTimeAnalytics[];
  userEngagement: EngagementMetrics;
}

export interface SlideAnalytics {
  slideId: string;
  views: number;
  averageTimeSpent: number;
}

export interface SlideTimeAnalytics {
  slideId: string;
  averageTime: number;
  totalTime: number;
}

export interface EngagementMetrics {
  chatUsage: number;
  voiceUsage: number;
  interactionRate: number;
  bounceRate: number;
}

export interface ChatInteractionData {
  question: string;
  answer: string;
  timestamp: string;
  slideId?: string;
}

export interface SessionData {
  sessionId: string;
  startTime: string;
  endTime?: string;
  totalSlides: number;
  slidesViewed: number;
  interactions: number;
}
