import { Router } from 'express';
import { prisma } from '../lib/prisma';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/auth';
import { AnalyticsEvent, AnalyticsResponse } from '../types/analytics';

const router = Router();

// Track analytics event
router.post('/track', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { 
      presentationId, 
      sessionId, 
      eventType, 
      eventData 
    }: AnalyticsEvent = req.body;

    // Validate input
    if (!presentationId || !eventType) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'presentationId and eventType are required'
      });
    }

    // Verify presentation exists
    const presentation = await prisma.presentation.findUnique({
      where: { id: presentationId }
    });

    if (!presentation) {
      return res.status(404).json({
        error: 'Presentation not found',
        message: 'The specified presentation does not exist'
      });
    }

    // Create analytics record
    const analyticsRecord = await prisma.presentationAnalytics.create({
      data: {
        presentationId,
        sessionId,
        eventType,
        eventData: eventData || {},
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip
      }
    });

    res.status(201).json({
      success: true,
      id: analyticsRecord.id
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
    res.status(500).json({
      error: 'Tracking failed',
      message: 'An error occurred while tracking the event'
    });
  }
});

// Get presentation analytics
router.get('/presentation/:id', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    const { id } = req.params;

    // Check if presentation exists and user has access
    const presentation = await prisma.presentation.findUnique({
      where: { id },
      include: {
        author: true
      }
    });

    if (!presentation) {
      return res.status(404).json({
        error: 'Presentation not found',
        message: 'The requested presentation does not exist'
      });
    }

    const isOwner = presentation.authorId === req.user!.userId;
    const isAdmin = req.user!.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to view analytics for this presentation'
      });
    }

    // Get analytics data
    const analytics = await prisma.presentationAnalytics.findMany({
      where: { presentationId: id },
      orderBy: { timestamp: 'desc' }
    });

    // Calculate metrics
    const totalViews = analytics.filter(a => a.eventType === 'presentation_view').length;
    const uniqueViews = new Set(analytics.map(a => a.ipAddress)).size;
    
    const chatInteractions = analytics.filter(a => a.eventType === 'chat_interaction').length;
    const voiceInteractions = analytics.filter(a => a.eventType === 'voice_interaction').length;

    // Get slide analytics
    const slideChanges = analytics.filter(a => a.eventType === 'slide_change');
    const slideViews = slideChanges.reduce((acc, event) => {
      const slideId = event.eventData?.slideId || 'unknown';
      acc[slideId] = (acc[slideId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostViewedSlides = Object.entries(slideViews)
      .map(([slideId, views]) => ({ slideId, views, averageTimeSpent: 0 }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    // Calculate session metrics
    const sessions = await prisma.session.findMany({
      where: { presentationId: id }
    });

    const completedSessions = sessions.filter(s => s.endTime).length;
    const completionRate = sessions.length > 0 ? (completedSessions / sessions.length) * 100 : 0;

    const totalTimeSpent = sessions.reduce((acc, session) => {
      if (session.endTime) {
        return acc + (new Date(session.endTime).getTime() - new Date(session.startTime).getTime());
      }
      return acc;
    }, 0);

    const averageTimeSpent = sessions.length > 0 ? totalTimeSpent / sessions.length / 1000 : 0; // in seconds

    const response: AnalyticsResponse = {
      presentationId: id,
      totalViews,
      uniqueViews,
      averageTimeSpent,
      completionRate,
      chatInteractions,
      voiceInteractions,
      mostViewedSlides,
      timeSpentPerSlide: [], // TODO: Calculate from slide duration events
      userEngagement: {
        chatUsage: chatInteractions,
        voiceUsage: voiceInteractions,
        interactionRate: totalViews > 0 ? ((chatInteractions + voiceInteractions) / totalViews) * 100 : 0,
        bounceRate: sessions.length > 0 ? ((sessions.length - completedSessions) / sessions.length) * 100 : 0
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Analytics fetch error:', error);
    res.status(500).json({
      error: 'Analytics fetch failed',
      message: 'An error occurred while fetching analytics data'
    });
  }
});

// Get user's overall analytics
router.get('/user/overview', authenticateToken, async (req: AuthenticatedRequest, res) => {
  try {
    // Get user's presentations
    const presentations = await prisma.presentation.findMany({
      where: { authorId: req.user!.userId },
      select: { id: true }
    });

    const presentationIds = presentations.map(p => p.id);

    if (presentationIds.length === 0) {
      return res.json({
        totalPresentations: 0,
        totalViews: 0,
        totalInteractions: 0,
        averageEngagement: 0
      });
    }

    // Get analytics for all user presentations
    const analytics = await prisma.presentationAnalytics.findMany({
      where: {
        presentationId: { in: presentationIds }
      }
    });

    const totalViews = analytics.filter(a => a.eventType === 'presentation_view').length;
    const totalInteractions = analytics.filter(a => 
      a.eventType === 'chat_interaction' || a.eventType === 'voice_interaction'
    ).length;

    const averageEngagement = totalViews > 0 ? (totalInteractions / totalViews) * 100 : 0;

    res.json({
      totalPresentations: presentations.length,
      totalViews,
      totalInteractions,
      averageEngagement: Math.round(averageEngagement * 100) / 100
    });
  } catch (error) {
    console.error('User analytics fetch error:', error);
    res.status(500).json({
      error: 'Analytics fetch failed',
      message: 'An error occurred while fetching user analytics'
    });
  }
});

// Create or update session
router.post('/session', optionalAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const { presentationId, sessionToken, action } = req.body;

    if (!presentationId || !sessionToken || !action) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'presentationId, sessionToken, and action are required'
      });
    }

    if (action === 'start') {
      // Create new session
      const session = await prisma.session.create({
        data: {
          presentationId,
          sessionToken,
          userId: req.user?.userId,
          startTime: new Date(),
          isActive: true
        }
      });

      res.status(201).json(session);
    } else if (action === 'end') {
      // End existing session
      const session = await prisma.session.updateMany({
        where: {
          sessionToken,
          presentationId,
          isActive: true
        },
        data: {
          endTime: new Date(),
          isActive: false
        }
      });

      res.json({ success: true, updated: session.count });
    } else {
      res.status(400).json({
        error: 'Invalid action',
        message: 'Action must be either "start" or "end"'
      });
    }
  } catch (error) {
    console.error('Session management error:', error);
    res.status(500).json({
      error: 'Session management failed',
      message: 'An error occurred while managing the session'
    });
  }
});

export default router;
