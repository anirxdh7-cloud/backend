import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import destinationsRouter from './routes/destinations.routes.js';
import itineraryRouter from './routes/itinerary.routes.js';
import budgetRouter from './routes/budget.routes.js';
import feedbackRouter from './routes/feedback.routes.js';
import healthRouter from './routes/health.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// API Routes
app.use('/api/v1', healthRouter);
app.use('/api/v1/destinations', destinationsRouter);
app.use('/api/v1/itinerary', itineraryRouter);
app.use('/api/v1/budget', budgetRouter);
app.use('/api/v1/feedback', feedbackRouter);

// Welcome / API Index
app.get('/', (req, res) => {
  res.json({
    project: 'BharatExplore AI — India Tourism & Travel Planner',
    role: 'Backend REST API Service',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/v1/health',
      destinations: 'GET /api/v1/destinations',
      destinationDetail: 'GET /api/v1/destinations/:id',
      planItinerary: 'POST /api/v1/itinerary/plan',
      estimateBudget: 'POST /api/v1/budget/estimate',
      submitFeedback: 'POST /api/v1/feedback/submit',
      listFeedback: 'GET /api/v1/feedback/list',
    },
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url} - Endpoint not found`,
  });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred',
    error: err.message,
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 BharatExplore AI Backend Server running on port ${PORT}`);
  console.log(`📡 Local: http://localhost:${PORT}`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/v1/health`);
  console.log(`======================================================\n`);
});
