const promClient = require('prom-client');

// Create a Registry to register the metrics
const register = new promClient.Registry();

// Enable the collection of default metrics
promClient.collectDefaultMetrics({ register });

// Custom metrics for MC Taxi API
const httpRequestDurationMicroseconds = new promClient.Histogram({
  name: 'mc_taxi_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5]
});

const httpRequestsTotal = new promClient.Counter({
  name: 'mc_taxi_total_requests',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const fareCalculationsTotal = new promClient.Counter({
  name: 'mc_taxi_total_calculations',
  help: 'Total number of fare calculations',
  labelNames: ['vehicle_type', 'status']
});

const averageFareGauge = new promClient.Gauge({
  name: 'mc_taxi_average_fare',
  help: 'Average fare amount in PHP'
});

const vehicleTypeCounter = new promClient.Counter({
  name: 'mc_taxi_vehicle_type_count',
  help: 'Count of vehicle types used',
  labelNames: ['vehicle_type']
});

// Register the metrics
register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(httpRequestsTotal);
register.registerMetric(fareCalculationsTotal);
register.registerMetric(averageFareGauge);
register.registerMetric(vehicleTypeCounter);

// Metrics middleware
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // Record request
  httpRequestsTotal.inc({ method: req.method, route: req.route?.path || req.path, status_code: res.statusCode });
  
  // Record response time
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000; // Convert to seconds
    httpRequestDurationMicroseconds.observe(
      { method: req.method, route: req.route?.path || req.path, status_code: res.statusCode },
      duration
    );
  });
  
  next();
};

// Metrics endpoint
const metricsEndpoint = async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
};

// Helper functions to update metrics
const recordFareCalculation = (vehicleType, fare, success = true) => {
  fareCalculationsTotal.inc({ vehicle_type: vehicleType, status: success ? 'success' : 'error' });
  vehicleTypeCounter.inc({ vehicle_type: vehicleType });
  
  // Update average fare (this is a simplified approach)
  // In a real implementation, you'd want to calculate this from your database
  if (success && fare) {
    averageFareGauge.set(fare);
  }
};

module.exports = {
  register,
  metricsMiddleware,
  metricsEndpoint,
  recordFareCalculation
};
