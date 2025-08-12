import { Router } from 'express';
import { FileStorage } from '../lib/fileStorage';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { User } from '../types/auth';
import { Presentation } from '../types/presentation';

const router = Router();
const presentationStorage = new FileStorage<Presentation>('presentations.json');
const analyticsStorage = new FileStorage<any>('analytics.json');

// Simple analytics event structure
interface AnalyticsEvent {
  id: string;
  presentationId: string;
  sessionId?: string;
  eventType: 'PRESENTATION_START' | 'PRESENTATION_END' | 'SLIDE_VIEW' | 'CHAT_INTERACTION' | 'VOICE_INTERACTION';
  eventData?: any;
  timestamp: string;
  userAgent?: string;
  ipAddress?: string;
}

// Track analytics event
router.post('/track', optionalAuth, async (req: any, res) => {
  try {
    const { 
      presentationId, 
      sessionId, 
      eventType, 
      eventData 
    } = req.body;

    // Validate input
    if (!presentationId || !eventType) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'presentationId and eventType are required'
      });
    }

    // Verify presentation exists
    const presentation = await presentationStorage.findById(presentationId);
    if (!presentation) {
      return res.status(404).json({
        error: 'Presentation not found',
        message: 'The specified presentation does not exist'
      });
    }

    // Create analytics event
    const event: AnalyticsEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      presentationId,
      sessionId: sessionId || `session_${Date.now()}`,
      eventType,
      eventData: eventData || {},
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'] || '',
      ipAddress: req.ip || req.connection.remoteAddress || ''
    };

    // Store event
    await analyticsStorage.create(event);

    res.status(201).json({
      success: true,
      eventId: event.id,
      message: 'Analytics event tracked successfully'
    });
  } catch (error) {
    console.error('Error tracking analytics event:', error);
    res.status(500).json({
      error: 'Failed to track event',
      message: 'An error occurred while tracking the analytics event'
    });
  }
});

// Get analytics for a presentation (admin only)
router.get('/presentation/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;

    // Check if presentation exists
    const presentation = await presentationStorage.findById(id);
    if (!presentation) {
      return res.status(404).json({
        error: 'Presentation not found',
        message: 'The specified presentation does not exist'
      });
    }

    // Check if user has access (admin or author)
    if (req.user.role !== 'ADMIN' && presentation.authorId !== req.user.userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to view analytics for this presentation'
      });
    }

    // Get all analytics events for this presentation
    const allEvents = await analyticsStorage.read();
    const presentationEvents = allEvents.filter((event: AnalyticsEvent) => 
      event.presentationId === id
    );

    // Calculate basic metrics
    const totalViews = presentationEvents.filter((e: AnalyticsEvent) => 
      e.eventType === 'PRESENTATION_START'
    ).length;

    const totalSlideViews = presentationEvents.filter((e: AnalyticsEvent) => 
      e.eventType === 'SLIDE_VIEW'
    ).length;

    const totalChatInteractions = presentationEvents.filter((e: AnalyticsEvent) => 
      e.eventType === 'CHAT_INTERACTION'
    ).length;

    const totalVoiceInteractions = presentationEvents.filter((e: AnalyticsEvent) => 
      e.eventType === 'VOICE_INTERACTION'
    ).length;

    // Get unique sessions
    const uniqueSessions = [...new Set(presentationEvents.map((e: AnalyticsEvent) => e.sessionId))];

    // Calculate average session duration (simplified)
    const sessionDurations = uniqueSessions.map(sessionId => {
      const sessionEvents = presentationEvents.filter((e: AnalyticsEvent) => e.sessionId === sessionId);
      if (sessionEvents.length < 2) return 0;
      
      const startTime = new Date(sessionEvents[0].timestamp).getTime();
      const endTime = new Date(sessionEvents[sessionEvents.length - 1].timestamp).getTime();
      return endTime - startTime;
    });

    const avgSessionDuration = sessionDurations.length > 0 
      ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length 
      : 0;

    const analytics = {
      presentationId: id,
      presentationTitle: presentation.title,
      metrics: {
        totalViews,
        totalSlideViews,
        totalChatInteractions,
        totalVoiceInteractions,
        uniqueSessions: uniqueSessions.length,
        avgSessionDuration: Math.round(avgSessionDuration / 1000) // in seconds
      },
      events: presentationEvents.slice(0, 50), // Last 50 events
      generatedAt: new Date().toISOString()
    };

    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics',
      message: 'An error occurred while fetching analytics data'
    });
  }
});

// Get overall analytics summary (admin only)
router.get('/summary', authenticateToken, async (req: any, res) => {
  try {
    // Check admin access
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Admin access required'
      });
    }

    const presentations = await presentationStorage.read();
    const allEvents = await analyticsStorage.read();

    // Calculate overall metrics
    const totalPresentations = presentations.length;
    const publishedPresentations = presentations.filter((p: Presentation) => p.status === 'PUBLISHED').length;
    const totalViews = allEvents.filter((e: AnalyticsEvent) => e.eventType === 'PRESENTATION_START').length;
    const totalInteractions = allEvents.filter((e: AnalyticsEvent) => 
      e.eventType === 'CHAT_INTERACTION' || e.eventType === 'VOICE_INTERACTION'
    ).length;

    // Get unique sessions across all presentations
    const uniqueSessions = [...new Set(allEvents.map((e: AnalyticsEvent) => e.sessionId))];

    // Calculate engagement rate (interactions per view)
    const engagementRate = totalViews > 0 ? (totalInteractions / totalViews) * 100 : 0;

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentEvents = allEvents.filter((e: AnalyticsEvent) => 
      new Date(e.timestamp) >= thirtyDaysAgo
    );

    const summary = {
      overview: {
        totalPresentations,
        publishedPresentations,
        totalViews,
        totalInteractions,
        uniqueSessions: uniqueSessions.length,
        engagementRate: Math.round(engagementRate * 100) / 100
      },
      recentActivity: {
        last30Days: recentEvents.length,
        dailyAverage: Math.round(recentEvents.length / 30 * 100) / 100
      },
      topPresentations: presentations
        .filter((p: Presentation) => p.status === 'PUBLISHED')
        .map((p: Presentation) => {
          const presentationEvents = allEvents.filter((e: AnalyticsEvent) => e.presentationId === p.id);
          const views = presentationEvents.filter((e: AnalyticsEvent) => e.eventType === 'PRESENTATION_START').length;
          return {
            id: p.id,
            title: p.title,
            views,
            interactions: presentationEvents.filter((e: AnalyticsEvent) => 
              e.eventType === 'CHAT_INTERACTION' || e.eventType === 'VOICE_INTERACTION'
            ).length
          };
        })
        .sort((a, b) => b.views - a.views)
        .slice(0, 5),
      generatedAt: new Date().toISOString()
    };

    res.json(summary);
  } catch (error) {
    console.error('Error fetching analytics summary:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics summary',
      message: 'An error occurred while fetching analytics summary'
    });
  }
});

export default router;
