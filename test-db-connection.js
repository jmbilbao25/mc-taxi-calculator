const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'database-1.cboacuqkk7st.ap-northeast-1.rds.amazonaws.com',
  database: 'mc_taxi_calculator',
  password: 'D78SIf4QLaAATWWTMABu',
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
    require: true
  }
});

async function testConnection() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    await client.query('SELECT NOW()');
    console.log('✅ Database connection successful');
    
    // Check if tables exist
    const tables = ['fare_config', 'vehicle_types', 'fare_calculations', 'app_metrics'];
    
    for (const table of tables) {
      try {
        const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`✅ Table '${table}' exists with ${result.rows[0].count} records`);
      } catch (error) {
        console.log(`❌ Table '${table}' does not exist: ${error.message}`);
      }
    }
    
    // Test fare calculation
    try {
      const result = await client.query(`
        SELECT * FROM fare_config 
        WHERE vehicle_type = 'motorcycle' 
        AND 4 >= min_distance 
        AND 4 <= max_distance 
        AND is_active = true
        LIMIT 1
      `);
      
      if (result.rows.length > 0) {
        console.log('✅ Fare calculation test successful:', result.rows[0]);
      } else {
        console.log('⚠️  No fare configuration found for motorcycle at 4km');
      }
    } catch (error) {
      console.log('❌ Fare calculation test failed:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

testConnection();
