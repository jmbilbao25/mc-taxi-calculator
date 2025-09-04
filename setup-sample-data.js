const { Pool } = require('pg');
require('dotenv').config();

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'database-1.cboacuqkk7st.ap-northeast-1.rds.amazonaws.com',
  database: process.env.DB_NAME || 'mc_taxi_calculator',
  password: process.env.DB_PASSWORD || 'D78SIf4QLaAATWWTMABu',
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false,
    require: true
  },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 30000,
});

async function setupSampleData() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Setting up sample data...');
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing data...');
    await client.query('DELETE FROM fare_config WHERE is_active = true');
    await client.query('DELETE FROM vehicle_types WHERE is_active = true');
    
    // Insert sample vehicle types
    console.log('🚗 Adding sample vehicle types...');
    const vehicleTypes = [
      { name: 'motorcycle', display_name: 'Motorcycle', icon: 'zap' },
      { name: 'tricycle', display_name: 'Tricycle', icon: 'bike' },
      { name: 'car', display_name: 'Car', icon: 'car' },
      { name: 'van', display_name: 'Van', icon: 'truck' },
      { name: 'jeepney', display_name: 'Jeepney', icon: 'truck' }
    ];
    
    for (const vehicle of vehicleTypes) {
      await client.query(`
        INSERT INTO vehicle_types (name, display_name, icon, is_active)
        VALUES ($1, $2, $3, true)
        ON CONFLICT (name) DO UPDATE SET
          display_name = EXCLUDED.display_name,
          icon = EXCLUDED.icon,
          is_active = true
      `, [vehicle.name, vehicle.display_name, vehicle.icon]);
      console.log(`  ✅ Added ${vehicle.display_name}`);
    }
    
    // Insert sample fare configurations
    console.log('💰 Adding sample fare configurations...');
    
    const fareConfigs = [
      // Motorcycle
      { vehicle_type: 'motorcycle', min_distance: 0, max_distance: 1, base_price: 50.00, price_per_km: 0.00 },
      { vehicle_type: 'motorcycle', min_distance: 1, max_distance: 5, base_price: 50.00, price_per_km: 15.00 },
      { vehicle_type: 'motorcycle', min_distance: 5, max_distance: 10, base_price: 50.00, price_per_km: 12.00 },
      { vehicle_type: 'motorcycle', min_distance: 10, max_distance: 20, base_price: 50.00, price_per_km: 10.00 },
      { vehicle_type: 'motorcycle', min_distance: 20, max_distance: 50, base_price: 50.00, price_per_km: 8.00 },
      { vehicle_type: 'motorcycle', min_distance: 50, max_distance: 100, base_price: 50.00, price_per_km: 6.00 },
      { vehicle_type: 'motorcycle', min_distance: 100, max_distance: 1000, base_price: 50.00, price_per_km: 5.00 },
      
      // Tricycle
      { vehicle_type: 'tricycle', min_distance: 0, max_distance: 1, base_price: 60.00, price_per_km: 0.00 },
      { vehicle_type: 'tricycle', min_distance: 1, max_distance: 5, base_price: 60.00, price_per_km: 18.00 },
      { vehicle_type: 'tricycle', min_distance: 5, max_distance: 10, base_price: 60.00, price_per_km: 15.00 },
      { vehicle_type: 'tricycle', min_distance: 10, max_distance: 20, base_price: 60.00, price_per_km: 12.00 },
      { vehicle_type: 'tricycle', min_distance: 20, max_distance: 50, base_price: 60.00, price_per_km: 10.00 },
      { vehicle_type: 'tricycle', min_distance: 50, max_distance: 100, base_price: 60.00, price_per_km: 8.00 },
      { vehicle_type: 'tricycle', min_distance: 100, max_distance: 1000, base_price: 60.00, price_per_km: 6.00 },
      
      // Car
      { vehicle_type: 'car', min_distance: 0, max_distance: 1, base_price: 100.00, price_per_km: 0.00 },
      { vehicle_type: 'car', min_distance: 1, max_distance: 5, base_price: 100.00, price_per_km: 25.00 },
      { vehicle_type: 'car', min_distance: 5, max_distance: 10, base_price: 100.00, price_per_km: 20.00 },
      { vehicle_type: 'car', min_distance: 10, max_distance: 20, base_price: 100.00, price_per_km: 18.00 },
      { vehicle_type: 'car', min_distance: 20, max_distance: 50, base_price: 100.00, price_per_km: 15.00 },
      { vehicle_type: 'car', min_distance: 50, max_distance: 100, base_price: 100.00, price_per_km: 12.00 },
      { vehicle_type: 'car', min_distance: 100, max_distance: 1000, base_price: 100.00, price_per_km: 10.00 },
      
      // Van
      { vehicle_type: 'van', min_distance: 0, max_distance: 1, base_price: 150.00, price_per_km: 0.00 },
      { vehicle_type: 'van', min_distance: 1, max_distance: 5, base_price: 150.00, price_per_km: 35.00 },
      { vehicle_type: 'van', min_distance: 5, max_distance: 10, base_price: 150.00, price_per_km: 30.00 },
      { vehicle_type: 'van', min_distance: 10, max_distance: 20, base_price: 150.00, price_per_km: 25.00 },
      { vehicle_type: 'van', min_distance: 20, max_distance: 50, base_price: 150.00, price_per_km: 22.00 },
      { vehicle_type: 'van', min_distance: 50, max_distance: 100, base_price: 150.00, price_per_km: 18.00 },
      { vehicle_type: 'van', min_distance: 100, max_distance: 1000, base_price: 150.00, price_per_km: 15.00 },
      
      // Jeepney
      { vehicle_type: 'jeepney', min_distance: 0, max_distance: 1, base_price: 12.00, price_per_km: 0.00 },
      { vehicle_type: 'jeepney', min_distance: 1, max_distance: 5, base_price: 12.00, price_per_km: 2.50 },
      { vehicle_type: 'jeepney', min_distance: 5, max_distance: 10, base_price: 12.00, price_per_km: 2.00 },
      { vehicle_type: 'jeepney', min_distance: 10, max_distance: 20, base_price: 12.00, price_per_km: 1.50 },
      { vehicle_type: 'jeepney', min_distance: 20, max_distance: 50, base_price: 12.00, price_per_km: 1.00 },
      { vehicle_type: 'jeepney', min_distance: 50, max_distance: 100, base_price: 12.00, price_per_km: 0.80 },
      { vehicle_type: 'jeepney', min_distance: 100, max_distance: 1000, base_price: 12.00, price_per_km: 0.50 }
    ];
    
    for (const config of fareConfigs) {
      await client.query(`
        INSERT INTO fare_config (vehicle_type, min_distance, max_distance, base_price, price_per_km, is_active)
        VALUES ($1, $2, $3, $4, $5, true)
        ON CONFLICT (vehicle_type, min_distance, max_distance) DO UPDATE SET
          base_price = EXCLUDED.base_price,
          price_per_km = EXCLUDED.price_per_km,
          is_active = true
      `, [config.vehicle_type, config.min_distance, config.max_distance, config.base_price, config.price_per_km]);
    }
    
    console.log(`  ✅ Added ${fareConfigs.length} fare configurations`);
    
    // Verify the data
    console.log('🔍 Verifying data...');
    const vehicleCount = await client.query('SELECT COUNT(*) FROM vehicle_types WHERE is_active = true');
    const configCount = await client.query('SELECT COUNT(*) FROM fare_config WHERE is_active = true');
    
    console.log(`📊 Summary:`);
    console.log(`  - Vehicle Types: ${vehicleCount.rows[0].count}`);
    console.log(`  - Fare Configurations: ${configCount.rows[0].count}`);
    
    console.log('✅ Sample data setup completed successfully!');
    console.log('🚀 You can now start the application and test the fare calculator.');
    
  } catch (error) {
    console.error('❌ Error setting up sample data:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the setup
setupSampleData()
  .then(() => {
    console.log('🎉 Setup completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });
