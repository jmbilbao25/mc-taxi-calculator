# How to Restart the MC Taxi Calculator API

## Quick Start Commands

```bash
# 1. Navigate to project directory (you're already here)
cd mc-taxi-calculator

# 2. Install/update dependencies (if needed)
npm install

# 3. Start the API server
npm run server

# OR for production mode:
NODE_ENV=production npm start

# OR to run in background:
nohup npm run server > app.log 2>&1 &
```

## Using PM2 (Recommended for Production)

```bash
# Install PM2 globally
npm install -g pm2

# Start the application with PM2
pm2 start server.js --name "mc-taxi-api"

# Check status
pm2 status

# View logs
pm2 logs mc-taxi-api

# Restart if needed
pm2 restart mc-taxi-api

# Stop
pm2 stop mc-taxi-api
```

## Environment Setup

Make sure you have the environment file:

```bash
# Copy environment template
cp env.example .env

# Edit environment variables (if needed)
nano .env
```

## Docker Method (Alternative)

If you prefer Docker:

```bash
# Build and run with docker-compose
docker-compose -f config/docker/docker-compose.yml up -d app

# Check logs
docker-compose -f config/docker/docker-compose.yml logs app
```

## Verify API is Running

```bash
# Test health endpoint
curl http://localhost:3001/api/health

# Test from external
curl http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4):3001/api/health
```

## Common Issues

1. **Port already in use**: Check if something is running on port 3001
   ```bash
   sudo netstat -tlnp | grep :3001
   sudo lsof -i :3001
   ```

2. **Permission issues**: Make sure you have proper permissions
   ```bash
   sudo chown -R ec2-user:ec2-user /path/to/mc-taxi-calculator
   ```

3. **Memory issues**: Check available memory
   ```bash
   free -h
   ```

## Monitor Application

Once started, you can access:
- API: http://your-ip:3001
- Health: http://your-ip:3001/api/health
- Metrics: http://your-ip:3001/metrics
- Grafana: http://your-ip:3000 (already running)
- Prometheus: http://your-ip:9090 (already running)
