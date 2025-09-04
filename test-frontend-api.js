// Test script to check what API URL the frontend is using
console.log('🔍 Testing Frontend API URL Configuration...\n');

// Simulate browser environment
global.fetch = require('node-fetch');

// Test the exact same logic used in the components
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://35.74.250.160:3001';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://35.74.250.160:3001';

console.log('Environment Variables:');
console.log('NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('');

console.log('Component API URLs:');
console.log('API_BASE:', API_BASE);
console.log('API_URL:', API_URL);
console.log('');

// Test the getApiUrl function
const getApiUrl = (endpoint) => {
  const baseUrl = API_URL.startsWith('http') ? API_URL : `http://${API_URL}`;
  return `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
};

console.log('Generated URLs:');
console.log('Vehicles:', getApiUrl('/api/fare-config/vehicles'));
console.log('Configs:', getApiUrl('/api/fare-config/configs'));
console.log('Calculate:', getApiUrl('/api/fare-config/calculate'));
console.log('');

// Test actual API calls
async function testApiCalls() {
  console.log('🧪 Testing actual API calls...\n');
  
  const endpoints = [
    '/api/fare-config/vehicles',
    '/api/fare-config/configs'
  ];
  
  for (const endpoint of endpoints) {
    const url = getApiUrl(endpoint);
    console.log(`Testing: ${url}`);
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Success: ${response.status}`);
        console.log(`   Data: ${JSON.stringify(data.data?.length || 0)} items`);
      } else {
        console.log(`❌ Error: ${response.status} - ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.log(`❌ Network Error: ${error.message}`);
    }
    console.log('');
  }
}

testApiCalls();
