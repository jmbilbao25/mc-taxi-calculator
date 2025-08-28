#!/bin/bash

# MC Taxi API - Grafana Monitoring Setup Script

set -e

echo "🚀 Setting up Grafana monitoring for MC Taxi API..."

# Create monitoring directories
echo "📁 Creating monitoring directories..."
mkdir -p monitoring/grafana/provisioning/datasources
mkdir -p monitoring/grafana/provisioning/dashboards
mkdir -p monitoring/grafana/dashboards

# Install prom-client if not already installed
echo "📦 Installing prom-client..."
npm install prom-client

# Start Grafana monitoring stack
echo "🐳 Starting Grafana monitoring stack..."
docker-compose -f docker-compose.grafana.yml up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
echo "🔍 Checking service status..."
docker-compose -f docker-compose.grafana.yml ps

echo ""
echo "✅ Grafana monitoring setup complete!"
echo ""
echo "📊 Access URLs:"
echo "   Grafana: http://localhost:3000 (admin/admin123)"
echo "   Prometheus: http://localhost:9090"
echo "   Node Exporter: http://localhost:9100"
echo "   cAdvisor: http://localhost:8080"
echo ""
echo "🔧 Next steps:"
echo "   1. Open Grafana at http://localhost:3000"
echo "   2. Login with admin/admin123"
echo "   3. The MC Taxi dashboard should be automatically loaded"
echo "   4. Make some API calls to see metrics in action"
echo ""
echo "📈 To see metrics:"
echo "   - Make fare calculation requests to your API"
echo "   - Check Prometheus targets at http://localhost:9090/targets"
echo "   - View metrics at http://localhost:9090/metrics"
echo ""
