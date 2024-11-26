import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/auth';
import scanRoutes from './routes/scans';
import { errorHandler } from './middleware/errorHandler';
import { prisma } from './lib/prisma';
import { redisClient } from './lib/redis';
import { specs } from './docs/swagger';

// Load environment variables
dotenv.config();

// Create Express app
export const app = express();
const port = process.env.PORT || 4000;

// Configure CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Body:', { ...req.body, password: req.body.password ? '[REDACTED]' : undefined });
  }
  
  // Log response
  const originalSend = res.send;
  res.send = function(body) {
    console.log('Response:', {
      statusCode: res.statusCode,
      body: typeof body === 'string' ? JSON.parse(body) : body
    });
    return originalSend.call(this, body);
  };
  
  next();
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'QRDecode.AI API Documentation',
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling
app.use(errorHandler);

// Start server only if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const startServer = async () => {
    try {
      // Test database connection
      await prisma.$connect();
      console.log('Connected to PostgreSQL');

      // Test Redis connection
      await redisClient.ping();
      console.log('Connected to Redis');

      // Start server
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        console.log(`API Documentation available at http://localhost:${port}/api-docs`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };

  startServer();
}
