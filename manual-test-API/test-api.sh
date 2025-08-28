#!/bin/bash

# API Base URL
API_URL="http://localhost:3001"

echo "🚀 Testing Fare Calculator API"
echo "================================"

# Test 1: Health Check
echo "1. Testing Health Check..."
curl -X GET "$API_URL/api/health" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n\n"

# Test 2: Calculate Fare - Motorcycle
echo "2. Testing Fare Calculation - Motorcycle (5.5km)..."
curl -X POST "$API_URL/api/calculate-fare" \
  -H "Content-Type: application/json" \
  -d '{
    "distance": 5.5,
    "vehicleType": "motorcycle",
    "clientId": "test-user-1"
  }' \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n\n"

# Test 3: Calculate Fare - Car
echo "3. Testing Fare Calculation - Car (3.2km)..."
curl -X POST "$API_URL/api/calculate-fare" \
  -H "Content-Type: application/json" \
  -d '{
    "distance": 3.2,
    "vehicleType": "car",
    "clientId": "test-user-2"
  }' \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n\n"

# Test 4: Calculate Fare - Long Distance
echo "4. Testing Fare Calculation - Long Distance (12km)..."
curl -X POST "$API_URL/api/calculate-fare" \
  -H "Content-Type: application/json" \
  -d '{
    "distance": 12,
    "vehicleType": "motorcycle",
    "clientId": "test-user-3"
  }' \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n\n"

# Test 5: Get Fare History
echo "5. Testing Get Fare History..."
curl -X GET "$API_URL/api/fare-history?page=1&limit=5" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n\n"

# Test 6: Get Metrics
echo "6. Testing Get Metrics..."
curl -X GET "$API_URL/api/metrics?period=7d" \
  -H "Content-Type: application/json" \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n\n"

# Test 7: Invalid Request (should fail)
echo "7. Testing Invalid Request (should fail)..."
curl -X POST "$API_URL/api/calculate-fare" \
  -H "Content-Type: application/json" \
  -d '{
    "distance": -5,
    "vehicleType": "invalid"
  }' \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n\n"

echo "API Testing Complete!"
