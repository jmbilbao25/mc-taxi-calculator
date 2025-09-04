// AWS RDS Database Configuration
const { Pool } = require('pg'); // For PostgreSQL
// const mysql = require('mysql2/promise'); // For MySQL

// PostgreSQL Connection
const createPostgreSQLPool = () => {
  return new Pool({
    user: process.env.DB_USER || 'admin',
    host: process.env.DB_HOST || 'mc-taxi-calculator-db.xxxxxxxxx.us-east-1.rds.amazonaws.com',
    database: process.env.DB_NAME || 'mc_taxi_calculator',
    password: process.env.DB_PASSWORD || 'SecurePassword123!',
    port: process.env.DB_PORT || 5432,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle
    connectionTimeoutMillis: 2000, // How long to wait for a connection
  });
};

// MySQL Connection (Alternative)
const createMySQLPool = () => {
  return mysql.createPool({
    host: process.env.DB_HOST || 'mc-taxi-calculator-db.xxxxxxxxx.us-east-1.rds.amazonaws.com',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'SecurePassword123!',
    database: process.env.DB_NAME || 'mc_taxi_calculator',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  });
};

// Initialize connection based on DB_TYPE
let db;

const initializeDatabase = async () => {
  try {
    const dbType = process.env.DB_TYPE || 'postgresql';
    
    if (dbType === 'postgresql') {
      db = createPostgreSQLPool();
      // Test connection
      const client = await db.connect();
      console.log('✅ Connected to PostgreSQL RDS');
      client.release();
    } else if (dbType === 'mysql') {
      db = createMySQLPool();
      // Test connection
      const connection = await db.getConnection();
      console.log('✅ Connected to MySQL RDS');
      connection.release();
    }
    
    return db;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

// Query helper for PostgreSQL
const queryPostgreSQL = async (text, params) => {
  const client = await db.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

// Query helper for MySQL
const queryMySQL = async (sql, params) => {
  const [rows] = await db.execute(sql, params);
  return { rows };
};

// Generic query function
const query = async (sql, params = []) => {
  const dbType = process.env.DB_TYPE || 'postgresql';
  
  if (dbType === 'postgresql') {
    return await queryPostgreSQL(sql, params);
  } else if (dbType === 'mysql') {
    return await queryMySQL(sql, params);
  }
};

// Graceful shutdown
const closeDatabase = async () => {
  if (db) {
    await db.end();
    console.log('🔒 Database connection closed');
  }
};

module.exports = {
  initializeDatabase,
  query,
  closeDatabase,
  db: () => db
};
