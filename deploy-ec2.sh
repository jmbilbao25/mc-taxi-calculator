#!/bin/bash

# AWS EC2 Deployment Script for Fare Calculator API
set -e

echo "🚀 Deploying Fare Calculator API to AWS EC2..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running on EC2
if [ ! -f /sys/hypervisor/uuid ]; then
    print_error "This script should be run on an EC2 instance"
    exit 1
fi

# Update system
print_status "Updating system packages..."
sudo yum update -y

# Install Docker
print_status "Installing Docker..."
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
print_status "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create app directory
print_status "Setting up application directory..."
mkdir -p /home/ec2-user/fare-calculator
cd /home/ec2-user/fare-calculator

# Copy application files (assuming they're uploaded or cloned)
# You can either:
# 1. Clone from GitHub
# 2. Upload files via SCP
# 3. Use AWS CodeDeploy

# For this example, we'll assume files are already here
if [ ! -f "server.js" ]; then
    print_error "Application files not found. Please upload your files first."
    exit 1
fi

# Create environment file
print_status "Creating environment configuration..."
cat > .env << EOF
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://bilbaojohnmichael_db_user:uitNnMCU2PHPt5Mu@mctaxi.usdejer.mongodb.net/?retryWrites=true&w=majority&appName=MCTAXI
DB_NAME=fare_calculator
EOF

# Build and start containers
print_status "Building and starting containers..."
sudo docker-compose -f docker-compose.prod.yml build
sudo docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Health check
print_status "Performing health checks..."

if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    print_status "✅ API is healthy"
else
    print_error "❌ API health check failed"
    sudo docker-compose -f docker-compose.prod.yml logs backend
    exit 1
fi

# Configure firewall (if using security groups)
print_status "Configuring firewall..."
sudo yum install -y firewalld
sudo systemctl start firewalld
sudo systemctl enable firewalld
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload

# Install and configure Nginx
print_status "Installing and configuring Nginx..."
sudo yum install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Create Nginx configuration
sudo tee /etc/nginx/conf.d/fare-calculator.conf > /dev/null << EOF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

print_status "🎉 Deployment completed successfully!"
print_status "Your API is now available at:"
print_status "http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)"
print_status "Health check: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)/api/health"

# Show running containers
print_status "Running containers:"
sudo docker-compose -f docker-compose.prod.yml ps
