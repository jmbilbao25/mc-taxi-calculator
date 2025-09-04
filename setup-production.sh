#!/bin/bash

# MC Taxi Calculator - Production Setup Script
# This script sets up the complete production environment

echo "🚀 MC Taxi Calculator - Production Setup"
echo "========================================"

# Function to create .env file for EC2
setup_ec2_env() {
    echo "📝 Setting up EC2 environment variables..."
    
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

# Monitoring
GRAFANA_URL=http://35.74.250.160:3000
PROMETHEUS_URL=http://35.74.250.160:9090

# Security
JWT_SECRET=mc-taxi-calculator-super-secret-jwt-key-2024
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://35.74.250.160:3000,http://35.74.250.160:3001,https://mc-taxi-calculator.vercel.app
EOF

    echo "✅ EC2 .env file created"
    chmod 600 .env
    echo "🔒 File permissions secured"
}

# Function to setup Vercel environment
setup_vercel_env() {
    echo "📝 Setting up Vercel environment variables..."
    
    if ! command -v vercel &> /dev/null; then
        echo "❌ Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Set environment variables for all environments
    echo "Setting NEXT_PUBLIC_API_URL for production..."
    echo "http://35.74.250.160:3001" | vercel env add NEXT_PUBLIC_API_URL production
    
    echo "Setting NEXT_PUBLIC_API_URL for preview..."
    echo "http://35.74.250.160:3001" | vercel env add NEXT_PUBLIC_API_URL preview
    
    echo "Setting NEXT_PUBLIC_API_URL for development..."
    echo "http://35.74.250.160:3001" | vercel env add NEXT_PUBLIC_API_URL development
    
    echo "✅ Vercel environment variables set"
}

# Function to setup database
setup_database() {
    echo "🗄️ Setting up database..."
    
    if [ -f "setup-database.js" ]; then
        echo "Creating database schema..."
        node setup-database.js
    else
        echo "⚠️ setup-database.js not found, skipping database setup"
    fi
    
    if [ -f "setup-sample-data.js" ]; then
        echo "Adding sample data..."
        node setup-sample-data.js
    else
        echo "⚠️ setup-sample-data.js not found, skipping sample data"
    fi
}

# Function to start services
start_services() {
    echo "🚀 Starting services..."
    
    if [ -f "docker-compose.simple-images.yml" ]; then
        echo "Starting with Docker Compose..."
        docker-compose -f docker-compose.simple-images.yml up -d
    else
        echo "⚠️ docker-compose.simple-images.yml not found"
    fi
}

# Main menu
echo ""
echo "Select setup option:"
echo "1) Setup EC2 environment only"
echo "2) Setup Vercel environment only"
echo "3) Setup both EC2 and Vercel"
echo "4) Setup database only"
echo "5) Start services only"
echo "6) Full production setup (all of the above)"
echo ""

read -p "Enter your choice (1-6): " choice

case $choice in
    1)
        setup_ec2_env
        ;;
    2)
        setup_vercel_env
        ;;
    3)
        setup_ec2_env
        setup_vercel_env
        ;;
    4)
        setup_database
        ;;
    5)
        start_services
        ;;
    6)
        setup_ec2_env
        setup_vercel_env
        setup_database
        start_services
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Check that all services are running: docker ps"
echo "2. Test the API: curl http://35.74.250.160:3001/api/health"
echo "3. Test the frontend: http://35.74.250.160:3000"
echo "4. Test the admin panel: http://35.74.250.160:3000/admin"
echo "5. Check monitoring: http://35.74.250.160:3000 (Grafana)"
echo ""
echo "🔧 Troubleshooting:"
echo "- Check logs: docker-compose -f docker-compose.simple-images.yml logs"
echo "- Restart services: docker-compose -f docker-compose.simple-images.yml restart"
echo "- Check environment: cat .env"
