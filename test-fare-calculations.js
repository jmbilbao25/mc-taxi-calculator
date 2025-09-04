const FareConfig = require('./models/FareConfig');

async function testFareCalculations() {
  console.log('🧪 Testing Philippine Taxi Fare Calculations...\n');
  
  const fareConfig = new FareConfig();
  
  // Test cases from your examples
  const testCases = [
    { distance: 2, expected: 50, description: '2km = 50 pesos' },
    { distance: 3, expected: 60, description: '3km = 60 pesos' },
    { distance: 4, expected: 70, description: '4km = 70 pesos' },
    { distance: 5, expected: 80, description: '5km = 80 pesos' },
    { distance: 6, expected: 90, description: '6km = 90 pesos' },
    { distance: 7, expected: 100, description: '7km = 100 pesos' },
    { distance: 8, expected: 110, description: '8km = 110 pesos' },
    { distance: 9, expected: 122, description: '9km = 122 pesos' },
    { distance: 9.740, expected: 130.88, description: '9.740km = 130.88 pesos' }
  ];
  
  let allPassed = true;
  
  for (const testCase of testCases) {
    try {
      const result = await fareConfig.calculateFare('motorcycle', testCase.distance);
      const actual = result.fare;
      const passed = Math.abs(actual - testCase.expected) < 0.01; // Allow small floating point differences
      
      console.log(`📊 ${testCase.description}`);
      console.log(`   Expected: ₱${testCase.expected}`);
      console.log(`   Actual: ₱${actual}`);
      console.log(`   Status: ${passed ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`   Breakdown: ${result.breakdown.calculation}\n`);
      
      if (!passed) {
        allPassed = false;
      }
    } catch (error) {
      console.error(`❌ Error testing ${testCase.distance}km:`, error.message);
      allPassed = false;
    }
  }
  
  await fareConfig.close();
  
  console.log(`\n🎯 Overall Result: ${allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
  
  if (allPassed) {
    console.log('🎉 Fare calculation logic is working correctly!');
  } else {
    console.log('⚠️  Please check the fare calculation logic.');
  }
}

testFareCalculations();
