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
    
    // Split by semicolon but handle dollar-quoted strings properly
    const statements = [];
    let currentStatement = '';
    let inDollarQuote = false;
    let dollarTag = '';
    
    const lines = schema.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check for start of dollar-quoted string
      if (!inDollarQuote && trimmedLine.includes('$$')) {
        const dollarMatch = trimmedLine.match(/\$([^$]*)\$/);
        if (dollarMatch) {
          inDollarQuote = true;
          dollarTag = dollarMatch[0];
        }
      }
      
      currentStatement += line + '\n';
      
      // Check for end of dollar-quoted string
      if (inDollarQuote && trimmedLine.includes(dollarTag)) {
        inDollarQuote = false;
        dollarTag = '';
      }
      
      // If we're not in a dollar-quoted string and line ends with semicolon
      if (!inDollarQuote && trimmedLine.endsWith(';')) {
        statements.push(currentStatement.trim());
        currentStatement = '';
      }
    }
    
    // Add any remaining statement
    if (currentStatement.trim()) {
      statements.push(currentStatement.trim());
    }
    
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
            console.error('Statement:', statement.substring(0, 100) + '...');
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
