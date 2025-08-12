import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { FileStorage } from '../lib/fileStorage';
import { generateToken } from '../lib/jwt';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';
import { authenticateToken } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/auth';

const router = Router();
const userStorage = new FileStorage<User>('users.json');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name }: RegisterRequest = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Email, password, and name are required'
      });
    }

    // Check if user already exists
    const existingUser = await userStorage.findByField('email', email);

    if (existingUser) {
      return res.status(409).json({
        error: 'User already exists',
        message: 'A user with this email already exists'
      });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const userData = {
      email,
      password: hashedPassword,
      name,
      role: 'USER' as const // Default role
    };
    const user = await userStorage.create(userData as User);

    // Remove password from response
    const { password: _, ...userResponse } = user;

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const response: AuthResponse = {
      user: userResponse,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'An error occurred during registration'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password }: LoginRequest = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await userStorage.findByField('email', email);

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'An error occurred during login'
    });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req: any, res) => {
  try {
    const user = await userStorage.findById(req.user!.userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User profile not found'
      });
    }

    // Remove password from response
    const { password: _, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({
      error: 'Profile fetch failed',
      message: 'An error occurred while fetching user profile'
    });
  }
});

// Refresh token
router.post('/refresh', authenticateToken, async (req: any, res) => {
  try {
    const user = await userStorage.findById(req.user!.userId);

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'User not found'
      });
    }

    // Remove password from user object
    const { password: _, ...userResponse } = user;

    // Generate new token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const response: AuthResponse = {
      user: userResponse,
      token,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    };

    res.json(response);
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Token refresh failed',
      message: 'An error occurred while refreshing token'
    });
  }
});

export default router;
