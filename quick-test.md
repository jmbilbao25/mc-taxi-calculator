# 🧪 Quick API Testing Guide

## Prerequisites
1. Make sure your server is running: `npm run server:dev`
2. Make sure MongoDB is running
3. Create a `.env` file with your database connection

## Testing Methods

### Method 1: Using cURL (Command Line)

```bash
# Health Check
curl http://localhost:3001/api/health

# Calculate Fare - Motorcycle
curl -X POST http://localhost:3001/api/calculate-fare \
  -H "Content-Type: application/json" \
  -d '{"distance": 5.5, "vehicleType": "motorcycle"}'

# Calculate Fare - Car
curl -X POST http://localhost:3001/api/calculate-fare \
  -H "Content-Type: application/json" \
  -d '{"distance": 3.2, "vehicleType": "car"}'

# Get Fare History
curl http://localhost:3001/api/fare-history?page=1&limit=5

# Get Metrics
curl http://localhost:3001/api/metrics?period=7d
```

### Method 2: Using the Test Script

```bash
# Run the shell script (Linux/Mac)
chmod +x test-api.sh
./test-api.sh

# Run the JavaScript test
node test-api.js
```

### Method 3: Using Postman

1. Import the `postman-collection.json` file into Postman
2. Set the `baseUrl` variable to `http://localhost:3001`
3. Run the requests

### Method 4: Using Browser

Open these URLs in your browser:
- `http://localhost:3001/api/health`
- `http://localhost:3001/api/fare-history`
- `http://localhost:3001/api/metrics`

## Expected Results

### Health Check Response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "services": {
      "database": "connected (X records)"
    }
  }
}
```

### Calculate Fare Response:
```json
{
  "success": true,
  "data": {
    "calculationId": "...",
    "distance": 5.5,
    "totalFare": 85.00,
    "vehicleType": "motorcycle",
    "breakdown": "Base fare: ₱50.00\nAdditional 3.50km × ₱10.00 = ₱35.00",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### Fare History Response:
```json
{
  "success": true,
  "data": {
    "calculations": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalRecords": 5
    }
  }
}
```

## Common Issues & Solutions

### Issue: Connection Refused
**Solution:** Make sure your server is running on port 3001

### Issue: Database Connection Error
**Solution:** 
1. Check if MongoDB is running
2. Verify your `.env` file has correct `MONGODB_URI`

### Issue: Validation Errors
**Solution:** Check that your request body matches the expected schema:
- `distance` must be a positive number
- `vehicleType` must be either "motorcycle" or "car"

## Test Scenarios

1. **Valid Calculations:**
   - Short distance (0-2km)
   - Medium distance (3-8km)
   - Long distance (9km+)

2. **Edge Cases:**
   - Minimum distance (0.1km)
   - Very long distance (50km+)
   - Decimal distances (3.7km)

3. **Error Cases:**
   - Negative distance
   - Invalid vehicle type
   - Missing required fields

4. **Performance:**
   - Multiple rapid requests
   - Large history queries
   - Metrics aggregation
