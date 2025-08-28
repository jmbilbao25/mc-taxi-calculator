#!/bin/bash

echo "🚀 Deploying MC Taxi Simple Dashboard..."

# Stop monitoring stack
echo "📉 Stopping monitoring stack..."
docker-compose -f docker-compose.grafana.yml down

# Start monitoring stack
echo "📈 Starting monitoring stack..."
docker-compose -f docker-compose.grafana.yml up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Check if Prometheus is scraping metrics
echo "🔍 Checking Prometheus targets..."
curl -s "http://13.211.151.184:9090/api/v1/targets" | jq '.data.activeTargets[] | select(.labels.job == "mc-taxi-api")'

# Check if metrics endpoint is working
echo "📊 Testing metrics endpoint..."
curl -s http://13.211.151.184:3001/metrics | head -20

echo ""
echo "✅ Dashboard deployment complete!"
echo ""
echo "🌐 Access your services:"
echo "   Grafana:     http://13.211.151.184:3000"
echo "   Prometheus:  http://13.211.151.184:9090"
echo "   API:         http://13.211.151.184:3001"
echo "   Frontend:    http://13.211.151.184"
echo ""
echo "🔑 Grafana credentials:"
echo "   Username: admin"
echo "   Password: admin"
echo ""
echo "📋 Next steps:"
echo "   1. Go to http://13.211.151.184:3000"
echo "   2. Login with admin/admin"
echo "   3. The dashboard should auto-import"
echo "   4. If not, go to Dashboards > Import"
echo "   5. Upload: monitoring/grafana/dashboards/mc-taxi-dashboard.json"
