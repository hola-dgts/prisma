import { Router } from 'express';
import { FileStorage } from '../lib/fileStorage';
import { generateAccessToken } from '../lib/jwt';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { User } from '../types/auth';
import { 
  CreatePresentationRequest, 
  UpdatePresentationRequest, 
  PresentationResponse,
  Presentation 
} from '../types/presentation';

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
      presentationsWithAuthors.push({
        ...presentation,
        author: {
          id: author?.id || '',
          name: author?.name || 'Unknown',
          email: author?.email || ''
        }
      });
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

// Get single presentation by ID
router.get('/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const presentation = await presentationStorage.findById(id);

    if (!presentation) {
      return res.status(404).json({
        error: 'Presentation not found',
        message: 'The requested presentation does not exist'
      });
    }

    // Check if user has access (admin or author)
    if (req.user.role !== 'ADMIN' && presentation.authorId !== req.user.userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to view this presentation'
      });
    }

    const author = await userStorage.findById(presentation.authorId);
    const response: PresentationResponse = {
      ...presentation,
      author: {
        id: author?.id || '',
        name: author?.name || 'Unknown',
        email: author?.email || ''
      }
    };

    res.json(response);
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
    const { title, description, content }: CreatePresentationRequest = req.body;

    // Validate input
    if (!title) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Title is required'
      });
    }

    // Create presentation data
    const presentationData = {
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
      status: 'DRAFT' as const,
      accessToken: generateAccessToken(),
      authorId: req.user.userId
    };

    const presentation = await presentationStorage.create(presentationData as Presentation);

    const author = await userStorage.findById(presentation.authorId);
    const response: PresentationResponse = {
      ...presentation,
      author: {
        id: author?.id || '',
        name: author?.name || 'Unknown',
        email: author?.email || ''
      }
    };

    res.status(201).json(response);
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
    const { title, description, content, status }: UpdatePresentationRequest = req.body;

    const existingPresentation = await presentationStorage.findById(id);
    if (!existingPresentation) {
      return res.status(404).json({
        error: 'Presentation not found',
        message: 'The requested presentation does not exist'
      });
    }

    // Check if user has access (admin or author)
    if (req.user.role !== 'ADMIN' && existingPresentation.authorId !== req.user.userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to update this presentation'
      });
    }

    // Update presentation
    const updatedData = {
      ...existingPresentation,
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(content && { content }),
      ...(status && { status }),
      updatedAt: new Date().toISOString()
    };

    const presentation = await presentationStorage.update(id, updatedData);

    const author = await userStorage.findById(presentation.authorId);
    const response: PresentationResponse = {
      ...presentation,
      author: {
        id: author?.id || '',
        name: author?.name || 'Unknown',
        email: author?.email || ''
      }
    };

    res.json(response);
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

    const existingPresentation = await presentationStorage.findById(id);
    if (!existingPresentation) {
      return res.status(404).json({
        error: 'Presentation not found',
        message: 'The requested presentation does not exist'
      });
    }

    // Check if user has access (admin or author)
    if (req.user.role !== 'ADMIN' && existingPresentation.authorId !== req.user.userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to delete this presentation'
      });
    }

    await presentationStorage.delete(id);

    res.status(204).send();
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
        message: 'The requested presentation does not exist'
      });
    }

    // Check if user has access (admin or author)
    if (req.user.role !== 'ADMIN' && originalPresentation.authorId !== req.user.userId) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to duplicate this presentation'
      });
    }

    // Create duplicate
    const duplicateData = {
      title: `${originalPresentation.title} (Copy)`,
      description: originalPresentation.description,
      content: originalPresentation.content,
      status: 'DRAFT' as const,
      accessToken: generateAccessToken(),
      authorId: req.user.userId
    };

    const presentation = await presentationStorage.create(duplicateData as Presentation);

    const author = await userStorage.findById(presentation.authorId);
    const response: PresentationResponse = {
      ...presentation,
      author: {
        id: author?.id || '',
        name: author?.name || 'Unknown',
        email: author?.email || ''
      }
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error duplicating presentation:', error);
    res.status(500).json({
      error: 'Failed to duplicate presentation',
      message: 'An error occurred while duplicating the presentation'
    });
  }
});

// Get presentation by access token (public access)
router.get('/public/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const presentations = await presentationStorage.read();
    const presentation = presentations.find(p => p.accessToken === token && p.status === 'PUBLISHED');

    if (!presentation) {
      return res.status(404).json({
        error: 'Presentation not found',
        message: 'The requested presentation does not exist or is not published'
      });
    }

    // Return presentation without author details for public access
    res.json({
      id: presentation.id,
      title: presentation.title,
      description: presentation.description,
      content: presentation.content,
      status: presentation.status,
      createdAt: presentation.createdAt,
      updatedAt: presentation.updatedAt
    });
  } catch (error) {
    console.error('Error fetching public presentation:', error);
    res.status(500).json({
      error: 'Failed to fetch presentation',
      message: 'An error occurred while fetching the presentation'
    });
  }
});

export default router;
