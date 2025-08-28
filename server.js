const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/database');
const fareRoutes = require('./routes/fareRoutes');
const healthRoutes = require('./routes/healthRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');
const { metricsMiddleware, metricsEndpoint } = require('./middleware/metrics');

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://13.211.151.184:3000',
    'http://13.211.151.184:3001',
    'https://*.vercel.app',
    'https://mc-taxi-calculator.vercel.app',
    'https://mc-taxi-calculator-qxk71llvy-jmbilbao25s-projects.vercel.app',
    'https://mc-taxi-calculator-git-main-jmbilbao25s-projects.vercel.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Prometheus metrics middleware
app.use(metricsMiddleware);

// Routes
app.use('/api', fareRoutes);
app.use('/api', healthRoutes);
app.use('/api', metricsRoutes);

// Prometheus metrics endpoint
app.get('/metrics', metricsEndpoint);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Fare Calculator API',
    version: '1.0.0',
    endpoints: {
      'POST /api/calculate-fare': 'Calculate fare based on distance',
      'GET /api/fare-history': 'Retrieve calculation history',
      'GET /api/health': 'Health check endpoint',
      'GET /api/metrics': 'Custom metrics endpoint'
    }
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}`);
});

module.exports = app;
