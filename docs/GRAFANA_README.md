# 📊 MC Taxi API - Grafana Monitoring

This guide will help you set up comprehensive monitoring for your MC Taxi API using Grafana, Prometheus, and related tools.

## 🎯 What's Included

- **Grafana**: Beautiful dashboards and visualizations
- **Prometheus**: Metrics collection and storage
- **Node Exporter**: System metrics (CPU, memory, disk)
- **cAdvisor**: Container metrics
- **Custom Metrics**: API-specific metrics for fare calculations

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Node.js and npm
- Your MC Taxi API running

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install prom-client
   ```

2. **Run Setup Script**
   ```bash
   chmod +x setup-grafana.sh
   ./setup-grafana.sh
   ```

3. **Or Manual Setup**
   ```bash
   # Create directories
   mkdir -p monitoring/grafana/provisioning/datasources
   mkdir -p monitoring/grafana/provisioning/dashboards
   mkdir -p monitoring/grafana/dashboards
   
   # Start monitoring stack
   docker-compose -f docker-compose.grafana.yml up -d
   ```

## 📊 Access URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| **Grafana** | http://localhost:3000 | admin/admin123 |
| **Prometheus** | http://localhost:9090 | - |
| **Node Exporter** | http://localhost:9100 | - |
| **cAdvisor** | http://localhost:8080 | - |

## 📈 Dashboard Features

### MC Taxi API Dashboard
- **Total API Requests**: Count of all API calls
- **Total Fare Calculations**: Number of fare calculations
- **Average Fare**: Average fare amount in PHP
- **Vehicle Type Distribution**: Pie chart of vehicle types used
- **API Response Time**: Response time trends
- **Requests per Minute**: API throughput
- **System CPU Usage**: Server CPU utilization
- **System Memory Usage**: Server memory utilization

### Custom Metrics
- `mc_taxi_total_requests`: Total HTTP requests
- `mc_taxi_total_calculations`: Total fare calculations
- `mc_taxi_average_fare`: Average fare amount
- `mc_taxi_vehicle_type_count`: Vehicle type usage
- `mc_taxi_request_duration_seconds`: API response times

## 🔧 Configuration

### Prometheus Configuration
Located at `monitoring/prometheus.yml`:
- Scrapes metrics from your API at `/metrics`
- Collects system metrics from Node Exporter
- Collects container metrics from cAdvisor

### Grafana Configuration
- **Datasources**: Automatically configured to use Prometheus
- **Dashboards**: Pre-configured MC Taxi dashboard
- **Provisioning**: Automatic setup on startup

## 🐳 Docker Services

### Prometheus
- **Port**: 9090
- **Purpose**: Metrics collection and storage
- **Data Retention**: 200 hours

### Grafana
- **Port**: 3000
- **Purpose**: Dashboard visualization
- **Default User**: admin/admin123

### Node Exporter
- **Port**: 9100
- **Purpose**: System metrics collection

### cAdvisor
- **Port**: 8080
- **Purpose**: Container metrics collection

## 📊 Using the Dashboard

1. **Login to Grafana**
   - URL: http://localhost:3000
   - Username: admin
   - Password: admin123

2. **View MC Taxi Dashboard**
   - Should be automatically loaded
   - Or navigate to Dashboards → MC Taxi API Dashboard

3. **Generate Metrics**
   - Make API calls to your backend
   - Watch metrics update in real-time

## 🔍 Troubleshooting

### Services Not Starting
```bash
# Check service status
docker-compose -f docker-compose.grafana.yml ps

# View logs
docker-compose -f docker-compose.grafana.yml logs

# Restart services
docker-compose -f docker-compose.grafana.yml restart
```

### No Metrics Showing
1. **Check Prometheus Targets**
   - Go to http://localhost:9090/targets
   - Ensure all targets are "UP"

2. **Check API Metrics Endpoint**
   - Visit http://your-api-url:3001/metrics
   - Should return Prometheus metrics

3. **Verify Network Connectivity**
   - Ensure Prometheus can reach your API
   - Check firewall settings

### Dashboard Not Loading
1. **Check Grafana Logs**
   ```bash
   docker-compose -f docker-compose.grafana.yml logs grafana
   ```

2. **Verify Datasource**
   - Go to Configuration → Data Sources
   - Ensure Prometheus is connected

3. **Check Dashboard Provisioning**
   - Verify dashboard files are in correct location
   - Check file permissions

## 🛠️ Customization

### Adding New Metrics
1. **Update `middleware/metrics.js`**
   - Add new Prometheus metrics
   - Register them with the registry

2. **Update Dashboard**
   - Add new panels to `monitoring/grafana/dashboards/mc-taxi-dashboard.json`
   - Use PromQL queries to display data

### Modifying Dashboard
1. **Edit Dashboard JSON**
   - Modify `monitoring/grafana/dashboards/mc-taxi-dashboard.json`
   - Restart Grafana to apply changes

2. **Use Grafana UI**
   - Make changes in Grafana interface
   - Export updated dashboard JSON

## 📚 Useful PromQL Queries

```promql
# Total requests per minute
rate(mc_taxi_total_requests[1m]) * 60

# Average response time
rate(mc_taxi_request_duration_seconds_sum[5m]) / rate(mc_taxi_request_duration_seconds_count[5m])

# Vehicle type distribution
mc_taxi_vehicle_type_count

# Error rate
rate(mc_taxi_total_calculations{status="error"}[5m])
```

## 🔒 Security Considerations

- **Change Default Passwords**: Update Grafana admin password
- **Network Security**: Restrict access to monitoring ports
- **Data Retention**: Configure appropriate retention periods
- **Access Control**: Set up proper user roles and permissions

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Docker logs for error messages
3. Verify all services are running and accessible
4. Ensure your API is generating metrics correctly

---

**Happy Monitoring! 📊🚀**
