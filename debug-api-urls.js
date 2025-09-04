// Debug script to check API URL configuration
console.log('🔍 Debugging API URL Configuration...\n');

// Simulate the environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://35.74.250.160:3001';

// Test the API URL construction logic from the components
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://35.74.250.160:3001';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://35.74.250.160:3001';

console.log('Environment Variables:');
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('');

console.log('Component API URLs:');
console.log('FareConfigPanel API_BASE:', API_BASE);
console.log('VehicleSelector API_BASE:', API_BASE);
console.log('useFareCalculator API_URL:', API_URL);
console.log('');

console.log('Test API Endpoints:');
console.log('Vehicles:', `${API_BASE}/api/fare-config/vehicles`);
console.log('Configs:', `${API_BASE}/api/fare-config/configs`);
console.log('Calculate:', `${API_URL}/api/fare-config/calculate`);
console.log('');

// Test the getApiUrl function from useFareCalculator
const getApiUrl = (endpoint) => {
  const baseUrl = API_URL.startsWith('http') ? API_URL : `http://${API_URL}`;
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

console.log('getApiUrl function tests:');
console.log('Calculate endpoint:', getApiUrl('/api/fare-config/calculate'));
console.log('Vehicles endpoint:', getApiUrl('/api/fare-config/vehicles'));
console.log('Configs endpoint:', getApiUrl('/api/fare-config/configs'));
