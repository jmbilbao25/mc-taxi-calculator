# Postman Collection for MC Taxi Calculator API

This folder contains a comprehensive Postman collection and environments for testing the MC Taxi Calculator API with all current endpoints.

## Files

- `MC-Taxi-Calculator-API.postman_collection.json` - Complete API collection with all endpoints and test cases
- `environments/Local-Development.postman_environment.json` - Local development environment
- `environments/Production.postman_environment.json` - Production environment with live URLs

## Quick Start

1. **Import into Postman**:
   - Import `MC-Taxi-Calculator-API.postman_collection.json`
   - Import both environment files from the `environments/` folder

2. **Select Environment**:
   - Choose "Local Development" for local testing
   - Choose "Production" for live server testing

3. **Start Testing**:
   - Run individual requests or use Collection Runner
   - All requests include automated test cases

## Collection Structure

### 🏥 Health & Status
- **Health Check** - API health status
- **API Info** - Get API information and available endpoints

### 💰 Fare Calculation
- **Calculate Fare (Main Endpoint)** - Primary fare calculation with Philippine taxi structure
- **Calculate Fare (Alternative Endpoint)** - Alternative calculation endpoint
- **Get Fare History** - Retrieve calculation history

### ⚙️ Fare Configuration Management
- **Get All Fare Configs** - Retrieve all fare configurations
- **Get Fare Config by Vehicle Type** - Get config for specific vehicle
- **Create New Fare Config** - Add new fare configuration
- **Update Fare Config** - Modify existing configuration
- **Delete Fare Config** - Remove configuration (soft delete)

### 🚗 Vehicle Management
- **Get Vehicle Types** - List all available vehicle types
- **Create Vehicle Type** - Add new vehicle type

### 📊 Metrics & Monitoring
- **Get Custom Metrics** - Application-specific metrics
- **Get Prometheus Metrics** - Prometheus-formatted metrics

### ❌ Error Testing
- **Invalid Fare Calculation** - Test various error scenarios
- **Missing Fields** - Test validation errors
- **Edge Cases** - Test boundary conditions

### 🚦 Rate Limiting Tests
- **Rate Limit Test** - Test API rate limiting (100 requests/15 minutes)

## Environment Variables

### Local Development
```json
{
  "baseUrl": "http://localhost:3001",
  "apiUrl": "{{baseUrl}}/api",
  "testClientId": "postman-local-test-{{timestamp}}",
  "frontendUrl": "http://localhost:3000"
}
```

### Production
```json
{
  "baseUrl": "http://35.74.250.160:3001",
  "apiUrl": "{{baseUrl}}/api", 
  "testClientId": "postman-prod-test-{{timestamp}}",
  "frontendUrl": "http://35.74.250.160:3000"
}
```

## API Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/` | API information |
| POST | `/api/calculate-fare` | Calculate fare (main) |
| POST | `/api/fare-config/calculate` | Calculate fare (alt) |
| GET | `/api/fare-history` | Get calculation history |
| GET | `/api/fare-config/configs` | Get all fare configs |
| GET | `/api/fare-config/configs/:vehicleType` | Get config by vehicle |
| POST | `/api/fare-config/configs` | Create fare config |
| PUT | `/api/fare-config/configs/:id` | Update fare config |
| DELETE | `/api/fare-config/configs/:id` | Delete fare config |
| GET | `/api/fare-config/vehicles` | Get vehicle types |
| POST | `/api/fare-config/vehicles` | Create vehicle type |
| DELETE | `/api/fare-config/vehicles/:id` | Delete vehicle type |
| GET | `/api/metrics` | Custom metrics |
| GET | `/metrics` | Prometheus metrics |

## Test Cases Included

### Automated Tests
- ✅ Status code validation
- ✅ Response time checks (< 2s for calculations, < 1s for health)
- ✅ JSON content-type verification
- ✅ Response structure validation
- ✅ Error handling verification

### Manual Test Scenarios
- 🧪 Various distance values (0, negative, decimal, large)
- 🧪 Different vehicle types
- 🧪 Rate limiting behavior
- 🧪 Missing/invalid parameters
- 🧪 Database operations (CRUD)

## Running Tests

### Postman Collection Runner
1. Open Collection Runner in Postman
2. Select the MC Taxi Calculator API collection
3. Choose environment (Local Development or Production)
4. Set iterations and delay as needed
5. Click "Run" to execute all tests

### Newman CLI Usage

```bash
# Install Newman
npm install -g newman

# Run collection with local environment
newman run MC-Taxi-Calculator-API.postman_collection.json \
  -e environments/Local-Development.postman_environment.json

# Run with production environment
newman run MC-Taxi-Calculator-API.postman_collection.json \
  -e environments/Production.postman_environment.json

# Run with specific iterations and delay
newman run MC-Taxi-Calculator-API.postman_collection.json \
  -e environments/Local-Development.postman_environment.json \
  -n 3 \
  --delay-request 1000

# Generate HTML report
newman run MC-Taxi-Calculator-API.postman_collection.json \
  -e environments/Local-Development.postman_environment.json \
  -r html \
  --reporter-html-export report.html
```

## Sample Request Bodies

### Calculate Fare
```json
{
  "distance": 10.5,
  "vehicleType": "motorcycle",
  "clientId": "{{testClientId}}"
}
```

### Create Fare Config
```json
{
  "vehicle_type": "car",
  "min_distance": 0,
  "max_distance": 10,
  "base_price": 40,
  "price_per_km": 13.5
}
```

### Create Vehicle Type
```json
{
  "name": "tricycle",
  "display_name": "Tricycle",
  "icon": "bike"
}
```

### Delete Vehicle Type
```
DELETE /api/fare-config/vehicles/1
```
*Note: Cannot delete if there are active fare configurations using this vehicle type.*

## Troubleshooting

### Common Issues
1. **Connection Refused**: Ensure the API server is running
2. **404 Errors**: Check if the endpoint URL is correct
3. **Rate Limiting**: Wait 15 minutes or use different client IDs
4. **Database Errors**: Ensure database is connected and tables exist

### Environment Setup
- Local: Make sure both frontend (port 3000) and backend (port 3001) are running
- Production: Verify the server is accessible at the configured URLs

## Features

- 🔄 **Dynamic Variables**: Uses timestamps for unique client IDs
- 🧪 **Comprehensive Testing**: Automated tests for all endpoints
- 📊 **Error Scenarios**: Tests for validation and edge cases
- 🚦 **Rate Limiting**: Tests API protection mechanisms
- 📈 **Performance**: Response time validation
- 🔧 **Environment Support**: Separate configs for local and production
