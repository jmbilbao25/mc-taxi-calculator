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

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(rateLimiter);

// Routes
app.use('/api', fareRoutes);
app.use('/api', healthRoutes);
app.use('/api', metricsRoutes);

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
