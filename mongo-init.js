// MongoDB initialization script
db = db.getSiblingDB('fare_calculator');

// Create collections
db.createCollection('farecalculations');
db.createCollection('appmetrics');

// Create indexes for better performance
db.farecalculations.createIndex({ "timestamp": -1 });
db.farecalculations.createIndex({ "clientId": 1 });
db.farecalculations.createIndex({ "vehicleType": 1 });
db.farecalculations.createIndex({ "distance": 1 });

// Create compound indexes
db.farecalculations.createIndex({ "vehicleType": 1, "timestamp": -1 });
db.farecalculations.createIndex({ "clientId": 1, "timestamp": -1 });

// Create text index for search functionality
db.farecalculations.createIndex({ "fareBreakdown": "text" });

// Initialize app metrics
db.appmetrics.insertOne({
  totalRequests: 0,
  totalCalculations: 0,
  averageFare: 0,
  popularVehicleTypes: [
    { type: 'motorcycle', count: 0 },
    { type: 'car', count: 0 }
  ],
  dailyStats: [],
  lastUpdated: new Date(),
  createdAt: new Date(),
  updatedAt: new Date()
});

print('MongoDB initialization completed successfully!');
