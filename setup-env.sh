#!/bin/bash

# MC Taxi Calculator - Environment Setup Script for EC2
# This script creates a .env file with all necessary environment variables

echo "🚀 Setting up environment variables for MC Taxi Calculator..."

# Create .env file with EOF syntax
cat > .env << 'EOF'
# Database Configuration
DB_USER=postgres
DB_HOST=database-1.cboacuqkk7st.ap-northeast-1.rds.amazonaws.com
DB_NAME=mc_taxi_calculator
DB_PASSWORD=D78SIf4QLaAATWWTMABu
DB_PORT=5432

# Server Configuration
PORT=3001
NODE_ENV=production

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://35.74.250.160:3001

# Monitoring (Optional)
GRAFANA_URL=http://35.74.250.160:3000
PROMETHEUS_URL=http://35.74.250.160:9090

# Security
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://35.74.250.160:3000,http://35.74.250.160:3001,https://mc-taxi-calculator.vercel.app

# SSL Configuration (for production)
SSL_CERT_PATH=/path/to/ssl/cert.pem
SSL_KEY_PATH=/path/to/ssl/private.key
EOF

echo "✅ Environment file created successfully!"
echo "📁 File location: $(pwd)/.env"
echo ""
echo "🔧 Next steps:"
echo "1. Review the .env file and update any values if needed"
echo "2. Run: chmod 600 .env (to secure the file)"
echo "3. Start your application with: docker-compose -f docker-compose.simple-images.yml up"
echo ""
echo "⚠️  Security Note: Make sure to change the JWT_SECRET in production!"
