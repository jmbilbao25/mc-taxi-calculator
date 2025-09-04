const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'database-1.cboacuqkk7st.ap-northeast-1.rds.amazonaws.com',
  database: process.env.DB_NAME || 'mc_taxi_calculator',
  password: process.env.DB_PASSWORD || 'D78SIf4QLaAATWWTMABu',
  port: process.env.DB_PORT || 5432,
  ssl: {
    rejectUnauthorized: false,
    require: true
  }
});

async function setupTables() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Setting up RDS database tables...');
    
    // Read and execute the schema
    const fs = require('fs');
    const path = require('path');
    const schemaPath = path.join(__dirname, 'config', 'database-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await client.query(statement);
          console.log('✅ Executed statement successfully');
        } catch (error) {
          if (error.message.includes('already exists')) {
            console.log('⚠️  Table/function already exists, skipping...');
          } else {
            console.error('❌ Error executing statement:', error.message);
          }
        }
      }
    }
    
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupTables()
    .then(() => {
      console.log('✅ Setup completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = setupTables;
