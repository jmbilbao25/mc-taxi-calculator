# 🐳 Docker Deployment Guide

This guide will help you containerize and deploy your Fare Calculator application using Docker.

## 📋 Prerequisites

- Docker Desktop installed and running
- Docker Compose installed
- Git (for version control)
- A domain name (for production deployment)

## 🚀 Quick Start

### 1. Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd mc-taxi-calculator

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 2. Production Deployment

```bash
# Copy environment file
cp env.production.example .env

# Edit environment variables
nano .env

# Deploy
chmod +x deploy.sh
./deploy.sh
```

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │    │   Frontend      │    │   Backend API   │
│   (Port 80/443) │    │   (Port 3000)   │    │   (Port 3001)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   MongoDB       │
                    │   (Port 27017)  │
                    └─────────────────┘
```

## 📁 File Structure

```
├── Dockerfile                 # Backend container
├── Dockerfile.frontend        # Frontend container
├── docker-compose.yml         # Development setup
├── docker-compose.prod.yml    # Production setup
├── .dockerignore             # Exclude files from build
├── nginx.conf                # Development Nginx config
├── nginx.prod.conf           # Production Nginx config
├── mongo-init.js             # MongoDB initialization
├── deploy.sh                 # Deployment script
├── env.production.example    # Environment template
└── DOCKER_README.md          # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.production.example`:

```env
# Production Environment Variables
NODE_ENV=production
PORT=3001

# MongoDB Configuration
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=your_secure_password_here
MONGODB_URI=mongodb://admin:your_secure_password_here@mongodb:27017/fare_calculator?authSource=admin
DB_NAME=fare_calculator

# API Configuration
API_URL=https://your-domain.com/api

# Security
JWT_SECRET=your_jwt_secret_here
SESSION_SECRET=your_session_secret_here
```

### Nginx Configuration

For production, update `nginx.prod.conf`:

1. Replace `your-domain.com` with your actual domain
2. Add SSL certificates to `./ssl/` directory
3. Update CORS origins if needed

## 🚀 Deployment Options

### Option 1: Local Development

```bash
# Start development environment
docker-compose up -d

# Access services
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# MongoDB: localhost:27017
```

### Option 2: Production (Single Server)

```bash
# Deploy to production
./deploy.sh

# Access services
# Frontend: https://your-domain.com
# Backend: https://your-domain.com/api
```

### Option 3: Cloud Deployment

#### AWS EC2
```bash
# Install Docker on EC2
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Clone and deploy
git clone <your-repo>
cd mc-taxi-calculator
./deploy.sh
```

#### DigitalOcean Droplet
```bash
# Install Docker on Ubuntu
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker

# Deploy
git clone <your-repo>
cd mc-taxi-calculator
./deploy.sh
```

#### Google Cloud Run
```bash
# Build and push images
docker build -t gcr.io/PROJECT_ID/fare-calculator-backend .
docker build -f Dockerfile.frontend -t gcr.io/PROJECT_ID/fare-calculator-frontend .

# Deploy to Cloud Run
gcloud run deploy fare-calculator-backend --image gcr.io/PROJECT_ID/fare-calculator-backend
gcloud run deploy fare-calculator-frontend --image gcr.io/PROJECT_ID/fare-calculator-frontend
```

## 🔍 Monitoring & Logs

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Production logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Health Checks
```bash
# Backend health
curl http://localhost:3001/api/health

# Frontend health
curl http://localhost:3000

# MongoDB health
docker-compose exec mongodb mongosh --eval "db.runCommand('ping')"
```

### Performance Monitoring
```bash
# Container stats
docker stats

# Resource usage
docker system df
```

## 🔧 Maintenance

### Update Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d
```

### Backup Database
```bash
# Create backup
docker-compose exec mongodb mongodump --out /data/backup/$(date +%Y%m%d)

# Copy backup to host
docker cp fare-calculator-mongodb:/data/backup ./backup
```

### Restore Database
```bash
# Copy backup to container
docker cp ./backup fare-calculator-mongodb:/data/restore

# Restore
docker-compose exec mongodb mongorestore /data/restore
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
sudo lsof -i :3001
sudo lsof -i :3000

# Kill process or change ports in docker-compose.yml
```

#### 2. MongoDB Connection Failed
```bash
# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

#### 3. Build Failed
```bash
# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

#### 4. Permission Issues
```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Fix Docker permissions
sudo usermod -a -G docker $USER
```

### Debug Commands
```bash
# Enter container
docker-compose exec backend sh
docker-compose exec frontend sh
docker-compose exec mongodb mongosh

# Check container status
docker-compose ps

# View container details
docker inspect fare-calculator-backend
```

## 🔒 Security Best Practices

### 1. Environment Variables
- Never commit `.env` files to version control
- Use strong, unique passwords
- Rotate secrets regularly

### 2. Network Security
- Use internal Docker networks
- Expose only necessary ports
- Implement rate limiting

### 3. Container Security
- Run containers as non-root users
- Keep base images updated
- Scan images for vulnerabilities

### 4. SSL/TLS
- Use Let's Encrypt for free SSL certificates
- Enable HTTP/2
- Implement security headers

## 📊 Performance Optimization

### 1. Image Optimization
- Use multi-stage builds
- Minimize layer count
- Use `.dockerignore` effectively

### 2. Resource Limits
- Set memory and CPU limits
- Monitor resource usage
- Scale horizontally when needed

### 3. Caching
- Enable Nginx caching
- Use CDN for static assets
- Implement database query caching

## 🚀 Scaling

### Horizontal Scaling
```bash
# Scale backend services
docker-compose -f docker-compose.prod.yml up -d --scale backend=3

# Use load balancer
# Update nginx.conf to include multiple backend servers
```

### Database Scaling
- Use MongoDB replica sets
- Implement read replicas
- Consider MongoDB Atlas for managed database

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review Docker and application logs
3. Check GitHub issues
4. Contact the development team

## 📝 License

This deployment guide is part of the Fare Calculator project and follows the same license terms.
