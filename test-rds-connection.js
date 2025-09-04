const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'database-1.cboacuqkk7st.ap-northeast-1.rds.amazonaws.com',
  database: 'postgres',
  password: 'D78SIf4QLaAATWWTMABu',
  port: 5432,
  ssl: false,
  connectionTimeoutMillis: 10000,
});

async function testConnection() {
  console.log('🔗 Testing RDS Connection...');
  console.log('Host: database-1.cboacuqkk7st.ap-northeast-1.rds.amazonaws.com');
  console.log('User: postgres');
  console.log('Database: postgres');
  console.log('Port: 5432');
  console.log('---');

  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to AWS RDS!');
    
    // Test basic query
    const result = await client.query('SELECT version()');
    console.log('📊 PostgreSQL Version:', result.rows[0].version.substring(0, 50) + '...');
    
    // Check current database
    const dbResult = await client.query('SELECT current_database()');
    console.log('🗄️  Current Database:', dbResult.rows[0].current_database);
    
    // Test creating our application database
    try {
      await client.query('CREATE DATABASE mc_taxi_calculator');
      console.log('✅ Created mc_taxi_calculator database successfully');
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log('✅ Database mc_taxi_calculator already exists');
      } else {
        console.log('⚠️  Database creation note:', err.message);
      }
    }
    
    // List all databases
    const listDb = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false');
    console.log('📋 Available Databases:');
    listDb.rows.forEach(row => console.log('   -', row.datname));
    
    client.release();
    console.log('---');
    console.log('🎉 RDS Connection Test SUCCESSFUL!');
    console.log('✅ Your EC2 instance can connect to AWS RDS');
    
  } catch (error) {
    console.error('❌ Connection FAILED:');
    console.error('   Error:', error.message);
    console.error('   Code:', error.code);
    
    if (error.code === 'ENOTFOUND') {
      console.error('🔍 DNS/Network issue - check security groups');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('🔍 Connection refused - check security groups and port');
    } else if (error.code === '28P01') {
      console.error('🔍 Authentication failed - check username/password');
    }
    
  } finally {
    await pool.end();
  }
}

// Handle script termination
process.on('SIGINT', async () => {
  console.log('\n🛑 Script interrupted');
  await pool.end();
  process.exit(0);
});

console.log('🚀 Starting AWS RDS Connection Test...\n');
testConnection();
