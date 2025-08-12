import { Router } from 'express';
import { FileStorage } from '../lib/fileStorage';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { User } from '../types/auth';
import { Presentation, PresentationResponse } from '../types/presentation';
import { generateToken } from '../lib/jwt';

const router = Router();
const presentationStorage = new FileStorage<Presentation>('presentations.json');
const userStorage = new FileStorage<User>('users.json');

// Get all presentations (admin only)
router.get('/', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    const presentations = await presentationStorage.read();
    
    // Add author information to each presentation
    const presentationsWithAuthors: PresentationResponse[] = [];
    
    for (const presentation of presentations) {
      const author = await userStorage.findById(presentation.authorId);
      if (author) {
        presentationsWithAuthors.push({
          ...presentation,
          author: {
            id: author.id,
            name: author.name,
            email: author.email
          }
        });
      }
    }
    
    res.json(presentationsWithAuthors);
  } catch (error) {
    console.error('Error fetching presentations:', error);
    res.status(500).json({
      error: 'Failed to fetch presentations',
      message: 'An error occurred while fetching presentations'
    });
  }
});

// Get single presentation by ID (admin only)
router.get('/:id', authenticateToken, requireAdmin, async (req: any, res) => {
  try {
    const { id } = req.params;
    const presentation = await presentationStorage.findById(id);
    
    if (!presentation) {
      return res.status(404).json({
        error: 'Presentation not found',
        message: 'The specified presentation does not exist'
      });
    }
    
    // Add author information
    const author = await userStorage.findById(presentation.authorId);
    const presentationWithAuthor: PresentationResponse = {
      ...presentation,
      author: author ? {
        id: author.id,
        name: author.name,
        email: author.email
      } : {
        id: '',
        name: 'Unknown',
        email: ''
      }
    };
    
    res.json(presentationWithAuthor);
  } catch (error) {
    console.error('Error fetching presentation:', error);
    res.status(500).json({
      error: 'Failed to fetch presentation',
      message: 'An error occurred while fetching the presentation'
    });
  }
});

// Create new presentation
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const { title, description, content } = req.body;
    
    if (!title) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Title is required'
      });
    }
    
    // Generate access token for the presentation
    const accessToken = generateToken({
      type: 'presentation_access',
      timestamp: Date.now()
    });
    
    const newPresentation: Presentation = {
      id: `pres_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title,
      description: description || '',
      content: content || {
        slides: [],
        theme: {
          primaryColor: '#DC2626',
          secondaryColor: '#B91C1C',
          backgroundColor: '#FFFFFF',
          textColor: '#262626',
          fontFamily: 'Inter'
        },
        settings: {
          autoPlay: false,
          autoPlayDelay: 5000,
          showNavigation: true,
          showProgress: true,
          allowChat: true,
          allowVoice: true
        }
      },
      status: 'DRAFT',
      authorId: req.user.userId,
      accessToken,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await presentationStorage.create(newPresentation);
    
    // Add author information for response
    const author = await userStorage.findById(req.user.userId);
    const presentationWithAuthor: PresentationResponse = {
      ...newPresentation,
      author: author ? {
        id: author.id,
        name: author.name,
        email: author.email
      } : {
        id: '',
        name: 'Unknown',
        email: ''
      }
    };
    
    res.status(201).json(presentationWithAuthor);
  } catch (error) {
    console.error('Error creating presentation:', error);
    res.status(500).json({
      error: 'Failed to create presentation',
      message: 'An error occurred while creating the presentation'
    });
  }
});

// Update presentation
router.put('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, status } = req.body;
    
    const presentation = await presentationStorage.findById(id);
    if (!presentation) {
      return res.status(404).json({
        error: 'Presentation not found',
        message: 'The specified presentation does not exist'
      });
    }
    
    // Check if user has permission to update
    if (req.user.role !== 'ADMIN' && presentation.authorId !== req.user.userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to update this presentation'
      });
    }
    
    const updatedPresentation: Presentation = {
      ...presentation,
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(content && { content }),
      ...(status && { status }),
      updatedAt: new Date().toISOString()
    };
    
    await presentationStorage.update(id, updatedPresentation);
    
    // Add author information for response
    const author = await userStorage.findById(presentation.authorId);
    const presentationWithAuthor: PresentationResponse = {
      ...updatedPresentation,
      author: author ? {
        id: author.id,
        name: author.name,
        email: author.email
      } : {
        id: '',
        name: 'Unknown',
        email: ''
      }
    };
    
    res.json(presentationWithAuthor);
  } catch (error) {
    console.error('Error updating presentation:', error);
    res.status(500).json({
      error: 'Failed to update presentation',
      message: 'An error occurred while updating the presentation'
    });
  }
});

// Delete presentation
router.delete('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    const presentation = await presentationStorage.findById(id);
    if (!presentation) {
      return res.status(404).json({
        error: 'Presentation not found',
        message: 'The specified presentation does not exist'
      });
    }
    
    // Check if user has permission to delete
    if (req.user.role !== 'ADMIN' && presentation.authorId !== req.user.userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to delete this presentation'
      });
    }
    
    await presentationStorage.delete(id);
    
    res.json({
      success: true,
      message: 'Presentation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting presentation:', error);
    res.status(500).json({
      error: 'Failed to delete presentation',
      message: 'An error occurred while deleting the presentation'
    });
  }
});

// Duplicate presentation
router.post('/:id/duplicate', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    
    const originalPresentation = await presentationStorage.findById(id);
    if (!originalPresentation) {
      return res.status(404).json({
        error: 'Presentation not found',
        message: 'The specified presentation does not exist'
      });
    }
    
    // Check if user has permission to duplicate
    if (req.user.role !== 'ADMIN' && originalPresentation.authorId !== req.user.userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to duplicate this presentation'
      });
    }
    
    // Generate new access token for the duplicated presentation
    const accessToken = generateToken({
      type: 'presentation_access',
      timestamp: Date.now()
    });
    
    const duplicatedPresentation: Presentation = {
      ...originalPresentation,
      id: `pres_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: `${originalPresentation.title} (Copy)`,
      status: 'DRAFT',
      authorId: req.user.userId,
      accessToken,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await presentationStorage.create(duplicatedPresentation);
    
    // Add author information for response
    const author = await userStorage.findById(req.user.userId);
    const presentationWithAuthor: PresentationResponse = {
      ...duplicatedPresentation,
      author: author ? {
        id: author.id,
        name: author.name,
        email: author.email
      } : {
        id: '',
        name: 'Unknown',
        email: ''
      }
    };
    
    res.status(201).json(presentationWithAuthor);
  } catch (error) {
    console.error('Error duplicating presentation:', error);
    res.status(500).json({
      error: 'Failed to duplicate presentation',
      message: 'An error occurred while duplicating the presentation'
    });
  }
});

// Public access to presentation by token
router.get('/public/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const presentation = await presentationStorage.findByField('accessToken', token);
    if (!presentation) {
      return res.status(404).json({
        error: 'Presentation not found',
        message: 'Invalid access token or presentation does not exist'
      });
    }
    
    // Only return published presentations for public access
    if (presentation.status !== 'PUBLISHED') {
      return res.status(403).json({
        error: 'Access denied',
        message: 'This presentation is not publicly available'
      });
    }
    
    // Return presentation without sensitive information
    const publicPresentation = {
      id: presentation.id,
      title: presentation.title,
      description: presentation.description,
      content: presentation.content,
      status: presentation.status
    };
    
    res.json(publicPresentation);
  } catch (error) {
    console.error('Error fetching public presentation:', error);
    res.status(500).json({
      error: 'Failed to fetch presentation',
      message: 'An error occurred while fetching the presentation'
    });
  }
});

export default router;
