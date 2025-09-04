const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'database-1.cboacuqkk7st.ap-northeast-1.rds.amazonaws.com',
  database: process.env.DB_NAME || 'mc_taxi_calculator',
  password: process.env.DB_PASSWORD || 'D78SIf4QLaAATWWTMABu',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

async function setupDatabase() {
  try {
    console.log('🚀 Starting database setup...');
    
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'config', 'database-schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📖 Reading schema file...');
    
    // Execute the schema
    console.log('🔧 Creating tables and inserting data...');
    await pool.query(schemaSQL);
    
    console.log('✅ Database setup completed successfully!');
    
    // Verify the setup
    console.log('🔍 Verifying setup...');
    
    // Check fare configs
    const fareConfigs = await pool.query('SELECT COUNT(*) as count FROM fare_config');
    console.log(`📊 Fare configurations: ${fareConfigs.rows[0].count}`);
    
    // Check vehicle types
    const vehicleTypes = await pool.query('SELECT COUNT(*) as count FROM vehicle_types');
    console.log(`🚗 Vehicle types: ${vehicleTypes.rows[0].count}`);
    
    // Show sample data
    const sampleConfigs = await pool.query(`
      SELECT fc.*, vt.display_name 
      FROM fare_config fc 
      JOIN vehicle_types vt ON fc.vehicle_type = vt.name 
      LIMIT 5
    `);
    
    console.log('\n📋 Sample fare configurations:');
    sampleConfigs.rows.forEach(config => {
      console.log(`  ${config.display_name}: ${config.min_distance}-${config.max_distance}km | Base: ₱${config.base_price} | Per km: ₱${config.price_per_km}`);
    });
    
    console.log('\n🎉 Database is ready for use!');
    console.log('💡 You can now access the admin panel at /admin to manage fare configurations.');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the setup
setupDatabase();
