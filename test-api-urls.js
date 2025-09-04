const fetch = require('node-fetch');

async function testApiUrls() {
  console.log('🧪 Testing API URLs...\n');
  
  const baseUrl = 'http://35.74.250.160:3001';
  const endpoints = [
    '/api/fare-config/vehicles',
    '/api/fare-config/configs'
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`📊 Testing: ${baseUrl}${endpoint}`);
      const response = await fetch(`${baseUrl}${endpoint}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ Success: ${response.status} - ${data.message || 'OK'}`);
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

testApiUrls();
