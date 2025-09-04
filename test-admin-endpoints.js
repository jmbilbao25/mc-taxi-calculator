const FareConfig = require('./models/FareConfig');

async function testAdminEndpoints() {
  console.log('🧪 Testing Admin Panel Endpoints...\n');
  
  const fareConfig = new FareConfig();
  
  try {
    // Test getting vehicle types
    console.log('📊 Testing vehicle types endpoint...');
    const vehicles = await fareConfig.getVehicleTypes();
    console.log('✅ Vehicle types retrieved successfully:');
    console.log(JSON.stringify(vehicles, null, 2));
    
    // Test getting fare configurations
    console.log('\n📊 Testing fare configurations endpoint...');
    const configs = await fareConfig.getAllFareConfigs();
    console.log('✅ Fare configurations retrieved successfully:');
    console.log(JSON.stringify(configs, null, 2));
    
  } catch (error) {
    console.error('❌ Error testing admin endpoints:', error.message);
  } finally {
    await fareConfig.close();
  }
}

testAdminEndpoints();
