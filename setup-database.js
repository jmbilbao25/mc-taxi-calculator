const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
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

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Setting up database schema...');
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'database-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await client.query(schema);
    
    console.log('✅ Database schema setup completed successfully!');
    console.log('📋 Tables created:');
    console.log('  - fare_config');
    console.log('  - vehicle_types');
    console.log('  - fare_calculations');
    console.log('  - app_metrics');
    console.log('  - Triggers and indexes');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log('🎉 Database setup completed!');
    console.log('💡 Next step: Run "node setup-sample-data.js" to add sample data');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Database setup failed:', error);
    process.exit(1);
  });
