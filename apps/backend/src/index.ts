import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

// Import routes
import authRoutes from './routes/auth';
import presentationRoutes from './routes/presentations';
import analyticsRoutes from './routes/analytics';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:3001', 
    'http://localhost:3003',
    'http://127.0.0.1:3001',
    'http://127.0.0.1:3003',
    /^http:\/\/127\.0\.0\.1:\d+$/,  // Browser previews
    /^http:\/\/localhost:\d+$/     // Any localhost port
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Increased limit for presentation content
app.use(express.urlencoded({ extended: true }));

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Health check
app.get('/health', async (req, res) => {
  try {
    // Test file system access
    const dataDir = path.join(process.cwd(), 'src/data');
    await fs.access(dataDir).catch(() => fs.mkdir(dataDir, { recursive: true }));
    
    res.json({ 
      status: 'ok', 
      service: 'Prisma v5 Backend',
      timestamp: new Date().toISOString(),
      storage: 'JSON File Storage',
      dataDirectory: dataDir
    });
  } catch (error) {
    res.status(503).json({
      status: 'error',
      service: 'Prisma v5 Backend',
      timestamp: new Date().toISOString(),
      storage: 'disconnected',
      error: 'File system access failed'
    });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/presentations', presentationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Chat endpoint (placeholder for now)
app.get('/api/chat', (req, res) => {
  res.json({ 
    message: 'Chat endpoint - Coming in Phase 6!',
    status: 'planned'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.originalUrl} not found`,
    availableRoutes: [
      'GET /health',
      'POST /api/auth/login',
      'POST /api/auth/register',
      'GET /api/auth/me',
      'GET /api/presentations',
      'POST /api/presentations',
      'GET /api/analytics/presentation/:id'
    ]
  });
});

// Error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  console.log('✅ JSON File Storage - No cleanup needed');
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  console.log('✅ JSON File Storage - No cleanup needed');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Prisma v5 Backend running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth`);
  console.log(`📋 Presentations: http://localhost:${PORT}/api/presentations`);
  console.log(`📈 Analytics: http://localhost:${PORT}/api/analytics`);
  console.log(`✨ TodoSeTransforma by Digitis`);
});

export default app;
