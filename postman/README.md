# Postman Collection for MC Taxi Calculator API

This folder contains Postman collections and environments for testing the MC Taxi Calculator API.

## Files

- `MC-Taxi-Calculator-API.postman_collection.json` - Complete API collection with all endpoints
- `environments/Local-Development.postman_environment.json` - Local development environment
- `environments/Production.postman_environment.json` - Production environment template

## Quick Start

1. Import the collection and environment files into Postman
2. Select the appropriate environment (Local Development or Production)
3. Update the `baseUrl` in the environment if needed
4. Run individual requests or the entire collection

## Collection Structure

### Fare Calculation
- Calculate Motorcycle Fare (supported)
- Calculate Car Fare (coming soon feature)
- Validation tests for edge cases

### Health & Status
- Health check endpoint
- Prometheus metrics endpoint

### Rate Limiting Tests
- Test API rate limiting (100 requests per 15 minutes)

### Edge Cases
- Maximum/minimum distance values
- Decimal distance values
- Validation error scenarios

## Environment Variables

### Local Development
- `baseUrl`: http://localhost:3001
- `apiUrl`: {{baseUrl}}/api
- `testClientId`: postman-local-test

### Production
- Update `baseUrl` to your production domain
- Keep other variables the same structure

## Running Tests

The collection includes basic tests for:
- Response time validation
- Content-Type header verification
- Status code checks

You can run the entire collection using Postman's Collection Runner or Newman CLI.

## Newman CLI Usage

```bash
# Install Newman
npm install -g newman

# Run collection with local environment
newman run MC-Taxi-Calculator-API.postman_collection.json \
  -e environments/Local-Development.postman_environment.json

# Run with specific iterations
newman run MC-Taxi-Calculator-API.postman_collection.json \
  -e environments/Local-Development.postman_environment.json \
  -n 3
```
