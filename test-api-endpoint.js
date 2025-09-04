const FareConfig = require('./models/FareConfig');

async function testFareCalculation() {
  console.log('🧪 Testing fare calculation endpoint...');
  
  try {
    const fareConfig = new FareConfig();
    
    console.log('📊 Testing fare calculation for motorcycle at 4km...');
    const result = await fareConfig.calculateFare('motorcycle', 4);
    
    console.log('✅ Fare calculation successful:');
    console.log(JSON.stringify(result, null, 2));
    
    await fareConfig.close();
    
  } catch (error) {
    console.error('❌ Fare calculation failed:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
  }
}

testFareCalculation();
