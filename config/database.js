const { Pool } = require('pg');

const connectDB = async () => {
  try {
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
      // Add connection timeout
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 30000,
    });

    // Test the connection
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();

    console.log(`✅ PostgreSQL Connected: ${process.env.DB_HOST || 'database-1.cboacuqkk7st.ap-northeast-1.rds.amazonaws.com'}`);
    
    // Store the pool globally for use in models
    global.dbPool = pool;
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    // Don't exit the process, just log the error
    console.log('⚠️  Continuing without database connection...');
  }
};

module.exports = connectDB;
