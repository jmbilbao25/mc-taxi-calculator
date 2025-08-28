# Fare Calculator Backend API

A comprehensive backend API for calculating taxi fares based on Philippine taxi fare structure.

## Features

- **Fare Calculation**: Calculate taxi fares using Philippine taxi fare structure
- **History Tracking**: Store and retrieve fare calculation history
- **Metrics & Analytics**: Track usage statistics and performance metrics
- **Health Monitoring**: Health check endpoints for monitoring
- **Rate Limiting**: Built-in rate limiting for API protection
- **Validation**: Request validation using Joi
- **Error Handling**: Comprehensive error handling middleware

## Philippine Taxi Fare Structure

The API implements the following fare structure:
- **0-1km**: Minimum fare of ₱50.00
- **1-2km**: Base fare of ₱50.00
- **3-8km**: ₱50.00 base + ₱10.00 per additional km
- **9km+**: ₱50.00 base + ₱60.00 (6km × ₱10.00) + ₱12.00 per km beyond 8km

## API Endpoints

### Calculate Fare
```
POST /api/calculate-fare
```
**Request Body:**
```json
{
  "distance": 5.5,
  "vehicleType": "motorcycle",
  "clientId": "user123",
  "location": {
    "lat": 14.5995,
    "lng": 120.9842
  }
}
```

### Get Fare History
```
GET /api/fare-history?page=1&limit=10&vehicleType=motorcycle
```

### Health Check
```
GET /api/health
```

### Metrics
```
GET /api/metrics?period=7d
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   PORT=3001
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/fare-calculator
   DB_NAME=fare_calculator
   ```

3. **Start MongoDB**
   Make sure MongoDB is running on your system or use a cloud instance.

4. **Run the Server**
   ```bash
   # Development mode with auto-restart
   npm run server:dev
   
   # Production mode
   npm run server
   ```

5. **Test the API**
   ```bash
   # Health check
   curl http://localhost:3001/api/health
   
   # Calculate fare
   curl -X POST http://localhost:3001/api/calculate-fare \
     -H "Content-Type: application/json" \
     -d '{"distance": 5.5}'
   ```

## Project Structure

```
├── server.js                 # Main server file
├── config/
│   └── database.js          # Database configuration
├── models/
│   ├── FareCalculation.js   # Fare calculation model
│   └── AppMetrics.js        # Application metrics model
├── controllers/
│   ├── fareController.js    # Fare calculation logic
│   ├── healthController.js  # Health check logic
│   └── metricsController.js # Metrics and analytics
├── routes/
│   ├── fareRoutes.js        # Fare-related routes
│   ├── healthRoutes.js      # Health check routes
│   └── metricsRoutes.js     # Metrics routes
├── middleware/
│   ├── validateFareRequest.js # Request validation
│   ├── rateLimiter.js       # Rate limiting
│   └── errorHandler.js      # Error handling
└── package.json
```

## Database Schema

### FareCalculation
- `distance`: Distance in kilometers
- `baseFare`: Base fare amount
- `perKmRate`: Rate per kilometer
- `totalFare`: Total calculated fare
- `vehicleType`: Type of vehicle (motorcycle or car)
- `fareBreakdown`: Text breakdown of fare calculation
- `tierDetails`: Detailed tier information
- `timestamp`: Calculation timestamp
- `clientId`: Client identifier
- `metadata`: Additional request metadata

### AppMetrics
- `totalRequests`: Total API requests
- `totalCalculations`: Total fare calculations
- `averageFare`: Average fare amount
- `popularVehicleTypes`: Vehicle type usage statistics
- `dailyStats`: Daily usage statistics
- `lastUpdated`: Last metrics update timestamp

## Development

### Running Tests
```bash
npm test
```

### API Documentation
Once the server is running, visit `http://localhost:3001` for API documentation.

### Environment Variables
- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)
- `MONGODB_URI`: MongoDB connection string
- `DB_NAME`: Database name

## Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting
- **Input Validation**: Request validation using Joi
- **Error Handling**: Comprehensive error handling

## Performance Features

- **Compression**: Response compression
- **Database Indexing**: Optimized database queries
- **Pagination**: Efficient data retrieval
- **Caching**: Built-in caching strategies

## Monitoring

The API includes comprehensive monitoring capabilities:
- Health check endpoints
- Performance metrics
- Usage statistics
- Error tracking
- Database connection monitoring

## License

This project is licensed under the MIT License.
