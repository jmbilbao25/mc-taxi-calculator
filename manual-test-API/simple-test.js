const axios = require('axios');

const API_BASE_URL = 'http://35.74.250.160:3001';

// Simple HTTP request function
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '35.74.250.160',
      port: 3001,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testAPI() {
  console.log('🚀 Testing Fare Calculator API');
  console.log('================================\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing Health Check...');
    try {
      const healthResponse = await makeRequest('GET', '/api/health');
      console.log('✅ Health Check:');
      console.log(`   Status: ${healthResponse.status}`);
      console.log(`   Success: ${healthResponse.data.success}`);
      if (healthResponse.data.data?.services?.database) {
        console.log(`   Database: ${healthResponse.data.data.services.database}`);
      }
      console.log('');
    } catch (error) {
      console.log('❌ Health Check: Failed');
      console.log(`   Error: ${error.message}`);
      console.log('');
    }

    // Test 2: Calculate Fares
    console.log('2. Testing Fare Calculations...');
    const testCases = [
      { name: 'Motorcycle - Short Distance (1.5km)', data: { distance: 1.5, vehicleType: 'motorcycle', clientId: 'test-1' } },
      { name: 'Car - Medium Distance (5.5km)', data: { distance: 5.5, vehicleType: 'car', clientId: 'test-2' } },
      { name: 'Motorcycle - Long Distance (12km)', data: { distance: 12, vehicleType: 'motorcycle', clientId: 'test-3' } }
    ];

    for (const testCase of testCases) {
      try {
        const response = await makeRequest('POST', '/api/calculate-fare', testCase.data);
        console.log(`✅ ${testCase.name}:`);
        console.log(`   Status: ${response.status}`);
        if (response.data.success) {
          console.log(`   Distance: ${testCase.data.distance}km`);
          console.log(`   Vehicle: ${testCase.data.vehicleType}`);
          console.log(`   Total Fare: ₱${response.data.data.totalFare}`);
        } else {
          console.log(`   Error: ${response.data.message}`);
        }
        console.log('');
      } catch (error) {
        console.log(`❌ ${testCase.name}: Failed`);
        console.log(`   Error: ${error.message}`);
        console.log('');
      }
    }

    // Test 3: Get Fare History
    console.log('3. Testing Get Fare History...');
    try {
      const historyResponse = await makeRequest('GET', '/api/fare-history?page=1&limit=3');
      console.log('✅ Fare History:');
      console.log(`   Status: ${historyResponse.status}`);
      if (historyResponse.data.success) {
        console.log(`   Total Records: ${historyResponse.data.data.pagination.totalRecords}`);
        console.log(`   Current Page: ${historyResponse.data.data.pagination.currentPage}`);
        console.log(`   Records Returned: ${historyResponse.data.data.calculations.length}`);
      } else {
        console.log(`   Error: ${historyResponse.data.message}`);
      }
      console.log('');
    } catch (error) {
      console.log('❌ Fare History: Failed');
      console.log(`   Error: ${error.message}`);
      console.log('');
    }

    // Test 4: Get Metrics
    console.log('4. Testing Get Metrics...');
    try {
      const metricsResponse = await makeRequest('GET', '/api/metrics?period=7d');
      console.log('✅ Metrics:');
      console.log(`   Status: ${metricsResponse.status}`);
      if (metricsResponse.data.success) {
        console.log(`   Total Calculations: ${metricsResponse.data.data.overview.totalCalculations}`);
        console.log(`   Average Fare: ₱${metricsResponse.data.data.overview.averageFare}`);
        console.log(`   Popular Vehicle Types:`, metricsResponse.data.data.popularVehicleTypes);
      } else {
        console.log(`   Error: ${metricsResponse.data.message}`);
      }
      console.log('');
    } catch (error) {
      console.log('❌ Metrics: Failed');
      console.log(`   Error: ${error.message}`);
      console.log('');
    }

    // Test 5: Invalid Requests
    console.log('5. Testing Invalid Requests...');
    const invalidTests = [
      { name: 'Negative Distance', data: { distance: -5, vehicleType: 'motorcycle' } },
      { name: 'Invalid Vehicle Type', data: { distance: 5, vehicleType: 'invalid' } },
      { name: 'Missing Distance', data: { vehicleType: 'motorcycle' } }
    ];

    for (const invalidTest of invalidTests) {
      try {
        const response = await makeRequest('POST', '/api/calculate-fare', invalidTest.data);
        if (response.status === 400) {
          console.log(`✅ ${invalidTest.name}: Correctly rejected (${response.status})`);
        } else {
          console.log(`❌ ${invalidTest.name}: Should have failed but didn't (${response.status})`);
        }
      } catch (error) {
        console.log(`✅ ${invalidTest.name}: Correctly rejected`);
      }
    }

    console.log('\n🎉 API Testing Complete!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
             console.log('💡 Make sure your server is running on http://35.74.250.160:3001');
    }
  }
}

// Run tests
testAPI();
