const promClient = require('prom-client');

// Create a simple registry
const register = new promClient.Registry();

// Enable default metrics (CPU, memory, etc.)
promClient.collectDefaultMetrics({ register });

// Simple request counter
const requestCounter = new promClient.Counter({
  name: 'mc_taxi_requests_total',
  help: 'Total number of requests',
  labelNames: ['method', 'endpoint']
});

// Simple fare calculation counter
const fareCounter = new promClient.Counter({
  name: 'mc_taxi_fare_calculations_total',
  help: 'Total number of fare calculations',
  labelNames: ['vehicle_type']
});

// Register metrics
register.registerMetric(requestCounter);
register.registerMetric(fareCounter);

// Simple middleware to count requests
const metricsMiddleware = (req, res, next) => {
  // Count all requests
  requestCounter.inc({ 
    method: req.method, 
    endpoint: req.path 
  });
  next();
};

// Simple metrics endpoint
const metricsEndpoint = async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.end(metrics);
  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).send('Metrics error');
  }
};

// Simple function to record fare calculations
const recordFareCalculation = (vehicleType) => {
  fareCounter.inc({ vehicle_type: vehicleType });
};

module.exports = {
  metricsMiddleware,
  metricsEndpoint,
  recordFareCalculation
};
