# 🚀 Migration from MongoDB to AWS RDS

## Overview
This guide will help you migrate the MC Taxi Calculator from MongoDB to AWS RDS (PostgreSQL/MySQL).

## 📋 Prerequisites
- AWS Account with RDS permissions
- AWS CLI configured
- Database client (pgAdmin, MySQL Workbench, or DBeaver)

## 🎯 Step 1: Choose Your RDS Database Engine

### Option A: PostgreSQL (Recommended)
- Better for complex queries
- Strong data consistency
- Good JSON support

### Option B: MySQL
- More familiar syntax
- Wide compatibility
- Good performance

## 🏗️ Step 2: Create AWS RDS Instance

### Using AWS Console:

1. **Login to AWS Console** → Navigate to RDS
2. **Create Database**:
   - Engine: PostgreSQL 15.x or MySQL 8.0
   - Template: Free tier (for testing) or Production
   - Instance identifier: `mc-taxi-calculator-db`
   - Master username: `admin`
   - Master password: `SecurePassword123!`
   - Instance class: `db.t3.micro` (free tier)
   - Storage: 20GB SSD
   - **Enable**: Public access (for now)
   - VPC Security Group: Create new or use default

### Using AWS CLI:
```bash
# PostgreSQL
aws rds create-db-instance \
    --db-instance-identifier mc-taxi-calculator-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --engine-version 15.4 \
    --master-username admin \
    --master-user-password SecurePassword123! \
    --allocated-storage 20 \
    --storage-type gp2 \
    --publicly-accessible \
    --backup-retention-period 7 \
    --storage-encrypted

# MySQL  
aws rds create-db-instance \
    --db-instance-identifier mc-taxi-calculator-db \
    --db-instance-class db.t3.micro \
    --engine mysql \
    --engine-version 8.0.35 \
    --master-username admin \
    --master-user-password SecurePassword123! \
    --allocated-storage 20 \
    --storage-type gp2 \
    --publicly-accessible \
    --backup-retention-period 7
```

## 🔧 Step 3: Configure Security Group

```bash
# Get your RDS security group ID
aws rds describe-db-instances \
    --db-instance-identifier mc-taxi-calculator-db \
    --query 'DBInstances[0].VpcSecurityGroups[0].VpcSecurityGroupId'

# Allow access from your EC2 instance
aws ec2 authorize-security-group-ingress \
    --group-id sg-xxxxxxxxx \
    --protocol tcp \
    --port 5432 \
    --source-group sg-xxxxxxxxx  # Your EC2 security group

# For MySQL use port 3306 instead of 5432
```

## 📊 Step 4: Design New Database Schema

### PostgreSQL Schema:
```sql
-- Create database
CREATE DATABASE mc_taxi_calculator;

-- Use the database
\c mc_taxi_calculator;

-- Fare calculations table
CREATE TABLE fare_calculations (
    id SERIAL PRIMARY KEY,
    distance DECIMAL(10,2) NOT NULL CHECK (distance >= 1 AND distance <= 1000),
    vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('motorcycle', 'car')),
    total_fare DECIMAL(10,2) NOT NULL,
    breakdown TEXT NOT NULL,
    client_id VARCHAR(100) NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- App metrics table
CREATE TABLE app_metrics (
    id SERIAL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    metric_type VARCHAR(50) NOT NULL,
    labels JSONB,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_fare_calculations_created_at ON fare_calculations(created_at);
CREATE INDEX idx_fare_calculations_vehicle_type ON fare_calculations(vehicle_type);
CREATE INDEX idx_app_metrics_name_recorded ON app_metrics(metric_name, recorded_at);
```

### MySQL Schema:
```sql
-- Create database
CREATE DATABASE mc_taxi_calculator;
USE mc_taxi_calculator;

-- Fare calculations table
CREATE TABLE fare_calculations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    distance DECIMAL(10,2) NOT NULL,
    vehicle_type ENUM('motorcycle', 'car') NOT NULL,
    total_fare DECIMAL(10,2) NOT NULL,
    breakdown TEXT NOT NULL,
    client_id VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_distance CHECK (distance >= 1 AND distance <= 1000)
);

-- App metrics table
CREATE TABLE app_metrics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    metric_type VARCHAR(50) NOT NULL,
    labels JSON,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_fare_calculations_created_at ON fare_calculations(created_at);
CREATE INDEX idx_fare_calculations_vehicle_type ON fare_calculations(vehicle_type);
CREATE INDEX idx_app_metrics_name_recorded ON app_metrics(metric_name, recorded_at);
```

## 🔌 Step 5: Update Application Code

### Install New Dependencies:
```bash
# For PostgreSQL
npm install pg

# For MySQL
npm install mysql2

# Remove MongoDB dependencies
npm uninstall mongoose
```

### Create Database Connection:

