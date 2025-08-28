#!/bin/bash

# Simple Deployment Script for Fare Calculator API
set -e

echo "🚀 Deploying Fare Calculator API..."

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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install it and try again."
    exit 1
fi

# Environment check
if [ ! -f ".env" ]; then
    print_warning "No .env file found. Creating from example..."
    if [ -f "env.production.example" ]; then
        cp env.production.example .env
        print_warning "Please edit .env file with your production values before continuing."
    else
        print_error "No .env file and no env.production.example found."
        exit 1
    fi
fi

# Build and deploy
print_status "Building Docker images..."
docker-compose -f docker-compose.prod.yml build

print_status "Starting services..."
docker-compose -f docker-compose.prod.yml up -d

print_status "Waiting for services to be ready..."
sleep 30

# Health check
print_status "Performing health checks..."

# Check backend health
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    print_status "✅ Backend is healthy"
else
    print_error "❌ Backend health check failed"
    docker-compose -f docker-compose.prod.yml logs backend
    exit 1
fi

# Check frontend health (if running)
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    print_status "✅ Frontend is healthy"
else
    print_warning "⚠️ Frontend health check failed (might not be running)"
fi

# Check MongoDB (if running locally)
if docker-compose -f docker-compose.prod.yml exec -T mongodb mongosh --eval "db.runCommand('ping')" > /dev/null 2>&1; then
    print_status "✅ MongoDB is healthy"
else
    print_warning "⚠️ MongoDB health check failed (might be using external MongoDB)"
fi

print_status "🎉 Deployment completed successfully!"
print_status "Frontend: http://localhost:3000"
print_status "Backend API: http://localhost:3001"
print_status "Health Check: http://localhost:3001/api/health"

# Show running containers
print_status "Running containers:"
docker-compose -f docker-compose.prod.yml ps
