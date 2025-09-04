# 📋 Step-by-Step Migration to AWS RDS

## Phase 1: Setup AWS RDS (30 minutes)

### 1️⃣ Create RDS Instance
```bash
# Login to AWS Console
# Go to RDS → Create Database

# Settings:
# - Engine: PostgreSQL 15.x
# - Template: Free tier
# - DB identifier: mc-taxi-calculator-db
# - Master username: admin
# - Master password: YourSecurePassword123!
# - Instance class: db.t3.micro
# - Storage: 20GB
# - Public access: Yes (for setup)
```

### 2️⃣ Configure Security Group
```bash
# Allow access from your EC2 instance
# Security Group Rules:
# - Type: PostgreSQL (5432)
# - Source: Your EC2 security group
```

### 3️⃣ Get Connection Details
```bash
# Note down from RDS Console:
# - Endpoint: mc-taxi-calculator-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
# - Port: 5432
# - Database name: postgres (default)
```

## Phase 2: Install Dependencies (5 minutes)

```bash
# SSH to your EC2 instance
cd mc-taxi-calculator

# Install PostgreSQL client
npm install pg

# Update package.json
npm uninstall mongoose
```

## Phase 3: Database Setup (15 minutes)

### 1️⃣ Connect to RDS and Create Schema
```bash
# Install PostgreSQL client on EC2
sudo yum install postgresql15 -y

# Connect to RDS
psql -h mc-taxi-calculator-db.xxxxxxxxx.us-east-1.rds.amazonaws.com \
     -p 5432 \
     -U admin \
     -d postgres

# Run the schema creation (copy from AWS-RDS-MIGRATION.md)
CREATE DATABASE mc_taxi_calculator;
\c mc_taxi_calculator;

# Create tables (copy the full schema from the migration doc)
```

### 2️⃣ Test Connection
```bash
# Test from EC2
psql -h your-rds-endpoint \
     -p 5432 \
     -U admin \
     -d mc_taxi_calculator \
     -c "SELECT version();"
```

## Phase 4: Update Application Code (20 minutes)

### 1️⃣ Update Environment Variables
```bash
# Edit your .env file
nano .env

# Add these variables:
DB_TYPE=postgresql
DB_HOST=mc-taxi-calculator-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=mc_taxi_calculator
DB_USER=admin
DB_PASSWORD=YourSecurePassword123!
```

### 2️⃣ Replace Database Files
```bash
# Copy the new files to your project:
# - config/database-rds.js
# - models/FareCalculationRDS.js

# Update server.js to use new database
```

### 3️⃣ Update Controllers
```bash
# Update controllers/fareController.js
# Replace mongoose calls with RDS model calls
```

## Phase 5: Update Application Code Files

### Update server.js:
```javascript
// Replace MongoDB connection with RDS
const { initializeDatabase, closeDatabase } = require('./config/database-rds');

// Initialize database
initializeDatabase().then(() => {
  console.log('✅ Database connected');
}).catch(err => {
  console.error('❌ Database connection failed:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await closeDatabase();
  process.exit(0);
});
```

### Update controllers/fareController.js:
```javascript
// Replace at the top:
// const FareCalculation = require('../models/FareCalculation');
const FareCalculationRDS = require('../models/FareCalculationRDS');

// In the calculateFare function, replace save logic:
const fareCalculation = new FareCalculationRDS({
  distance: distanceValue,
  vehicleType,
  totalFare,
  breakdown: breakdownText,
  clientId,
  ipAddress: req.ip,
  userAgent: req.get('User-Agent')
});

const savedCalculation = await fareCalculation.save();
```

## Phase 6: Testing (15 minutes)

### 1️⃣ Test Database Connection
```bash
# Start the app
npm run server

# Check logs for connection success
tail -f app.log
```

### 2️⃣ Test API Endpoints
```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Test fare calculation
curl -X POST http://localhost:3001/api/calculate-fare \
  -H "Content-Type: application/json" \
  -d '{"distance": 10, "vehicleType": "motorcycle", "clientId": "test"}'
```

### 3️⃣ Verify Data in Database
```bash
# Connect to RDS
psql -h your-rds-endpoint -U admin -d mc_taxi_calculator

# Check if data was inserted
SELECT * FROM fare_calculations ORDER BY created_at DESC LIMIT 5;
```

## Phase 7: Migration Data (if needed)

### Export from MongoDB:
```bash
# If you have existing data
mongoexport --uri="your-mongodb-uri" \
  --collection=farecalculations \
  --out=fare_calculations.json
```

### Import to RDS:
```bash
# Create a migration script to convert and import
# This step is optional if starting fresh
```

## Phase 8: Update Docker Configuration

### Update docker-compose file:
```yaml
# Remove MongoDB service
# Update backend environment variables
environment:
  - DB_TYPE=postgresql
  - DB_HOST=mc-taxi-calculator-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
  - DB_PORT=5432
  - DB_NAME=mc_taxi_calculator
  - DB_USER=admin
  - DB_PASSWORD=YourSecurePassword123!
```

## Phase 9: Final Cleanup (10 minutes)

### 1️⃣ Remove MongoDB Dependencies
```bash
# Remove old files
rm -rf models/FareCalculation.js
rm -rf models/AppMetrics.js
rm -rf config/database.js

# Update package.json to remove mongoose
npm uninstall mongoose
```

### 2️⃣ Update Documentation
```bash
# Update README.md with new database info
# Update environment variable examples
```

### 3️⃣ Test Everything
```bash
# Full system test
npm run server
curl http://localhost:3001/api/health
# Test Postman collection
```

## 🎉 Migration Complete!

Your application is now using AWS RDS instead of MongoDB. Benefits:
- ✅ Better performance and reliability
- ✅ Automatic backups
- ✅ Easy scaling
- ✅ AWS integration
- ✅ SQL queries for better reporting

## 🔒 Security Improvements (Optional)

1. **Disable public access** after testing
2. **Use IAM database authentication**
3. **Enable encryption at rest**
4. **Set up read replicas** for better performance

## 📊 Monitoring

- Check RDS CloudWatch metrics
- Set up alerts for connection issues
- Monitor query performance
- Set up automated backups

**Total Migration Time: ~1.5 hours**
