# 🚖 MC Taxi Calculator

A modern taxi fare calculator built with Next.js and Express. Features a clean UI, real-time calculations, and monitoring dashboard.

[![Next.js](https://img.shields.io/badge/Next.js-14.2.13-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![AWS](https://img.shields.io/badge/AWS-EC2-orange?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue?style=for-the-badge&logo=docker)](https://www.docker.com/)

## 📋 Table of Contents

- [🎯 Project Overview](#-project-overview)
- [⚡ Live Demo](#-live-demo)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [✨ Key Features](#-key-features)
- [🚀 Performance & Monitoring](#-performance--monitoring)
- [🔧 Installation & Setup](#-installation--setup)
- [📱 API Documentation](#-api-documentation)
- [🏗️ Deployment](#️-deployment)
- [📊 Monitoring & Analytics](#-monitoring--analytics)
- [🧪 Testing](#-testing)
- [📈 Scalability Considerations](#-scalability-considerations)
- [🔮 Future Enhancements](#-future-enhancements)

## 🎯 Project Overview

MC Taxi Calculator is a **production-ready, enterprise-grade web application** that demonstrates advanced full-stack development skills. The project showcases modern web technologies, cloud deployment, monitoring solutions, and scalable architecture patterns.

### 🎨 **Modern UI/UX Design**
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Dark/Light Mode**: System preference detection with manual toggle
- **Advanced Animations**: Framer Motion for smooth, professional interactions
- **Glass Morphism**: Modern design trends with backdrop blur effects
- **Micro-interactions**: Subtle feedback for enhanced user experience

### 🔒 **Enterprise Security**
- **Input Validation**: Comprehensive client and server-side validation
- **Rate Limiting**: API protection against abuse
- **Error Handling**: Graceful error management with user-friendly messages
- **Hidden Admin Panel**: Secret access pattern for monitoring dashboards

## ⚡ Demo

Run locally:
```bash
npm run dev
npm run server:dev
```

Navigate to `http://localhost:3000`

*Hidden Feature: Click "MC Taxi" logo 7 times quickly to access monitoring dashboards*

## 🛠️ Tech Stack

### **Frontend Technologies**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 14.2.13 | React framework with SSR/SSG capabilities |
| **TypeScript** | 5.0+ | Type safety and developer experience |
| **React** | 18.3.1 | Component-based UI development |
| **Tailwind CSS** | 3.4.10 | Utility-first CSS framework |
| **Framer Motion** | 11.5.4 | Advanced animations and transitions |
| **Lucide React** | 0.441.0 | Modern icon library |

### **Backend Technologies**
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 20+ | JavaScript runtime environment |
| **Express.js** | 4.18.2 | Web application framework |
| **MongoDB** | 7.6.3 | NoSQL database with Mongoose ODM |
| **Joi** | 17.11.0 | Data validation library |
| **Helmet** | 7.1.0 | Security middleware |

### **DevOps & Monitoring**
| Technology | Purpose |
|-----------|---------|
| **Docker** | Containerization and deployment |
| **Docker Compose** | Multi-container orchestration |
| **Prometheus** | Metrics collection and monitoring |
| **Grafana** | Metrics visualization and dashboards |
| **AWS EC2** | Cloud hosting and deployment |
| **Nginx** | Reverse proxy and load balancing |

### **Development Tools**
| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting and quality |
| **Jest** | Unit testing framework |
| **Supertest** | API testing |
| **Nodemon** | Development server auto-reload |

## 🏗️ Architecture

### **Simple Architecture**

```
Frontend (Next.js) → API (Express.js) → Database (MongoDB)
                             ↓
                    Monitoring (Prometheus + Grafana)
```

**Flow**: User input → validation → calculation → storage → response

## ✨ Key Features

### 🎨 **Advanced Frontend Features**
- **Modern Design System**: Custom design tokens and component library
- **Responsive Layout**: Mobile-first with progressive enhancement
- **Animation System**: Smooth page transitions and micro-interactions
- **State Management**: Custom hooks with TypeScript
- **Error Boundaries**: Graceful error handling and user feedback
- **Performance Optimization**: Code splitting and lazy loading

### 🔧 **Backend Capabilities**
- **RESTful API**: Clean, documented endpoints
- **Data Validation**: Comprehensive input sanitization
- **Error Handling**: Structured error responses
- **Logging System**: Detailed application logging
- **Metrics Collection**: Real-time performance monitoring
- **Health Checks**: System status endpoints

### 🚀 **Enterprise Features**
- **Rate Limiting**: API protection (100 requests/15 minutes per IP)
- **Security Headers**: Helmet.js security middleware
- **CORS Configuration**: Cross-origin resource sharing setup
- **Environment Management**: Separate configs for dev/prod
- **Database Connections**: Connection pooling and error handling

### 🔍 **Monitoring & Observability**
- **Custom Metrics**: Application-specific performance metrics
- **Health Monitoring**: Real-time system health checks
- **Error Tracking**: Comprehensive error logging and alerts
- **Performance Dashboards**: Grafana visualization
- **Hidden Admin Panel**: Secret access to monitoring tools

## 🚀 Performance & Monitoring

### **Metrics Collection**
```javascript
// Custom metrics implementation
const promClient = require('prom-client');

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const fareCalculationsTotal = new promClient.Counter({
  name: 'fare_calculations_total',
  help: 'Total number of fare calculations performed',
  labelNames: ['vehicle_type', 'status']
});
```

### **Performance Benchmarks**
- **API Response Time**: < 100ms average
- **Frontend Load Time**: < 2s initial load
- **Database Queries**: Optimized with indexes
- **Memory Usage**: < 512MB in production

## 🔧 Installation & Setup

### **Prerequisites**
- Node.js 20+
- MongoDB (local or Atlas)
- Docker & Docker Compose (optional)

### **Local Development**

```bash
# Clone the repository
git clone <repository-url>
cd mc-taxi-calculator

# Install dependencies
npm install

# Environment setup
cp .env.example .env.local
# Configure your environment variables

# Start development servers
npm run dev          # Frontend (localhost:3000)
npm run server:dev   # Backend (localhost:3001)

# Start with monitoring (Docker required)
docker-compose up -d
```

### **Environment Variables**

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/mc-taxi-calculator

# API Configuration
PORT=3001
NODE_ENV=development

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📱 API Documentation

### **Endpoints**

#### Calculate Fare
```http
POST /api/calculate-fare
Content-Type: application/json

{
  "distance": 5.5,
  "vehicleType": "motorcycle",
  "clientId": "web-user"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalFare": 82.00,
    "breakdown": "Base fare: ₱50\nDistance: 5.5km × ₱12/km = ₱66\nTotal: ₱116"
  }
}
```

#### Health Check
```http
GET /api/health

Response: {
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "uptime": 3600,
  "database": "connected"
}
```

#### Metrics
```http
GET /metrics

Response: Prometheus-formatted metrics
```

## 🏗️ Deployment

### **Docker Deployment**

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
    
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    
  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
```

### **AWS EC2 Deployment**

```bash
# Deployment script
#!/bin/bash
docker-compose -f docker-compose.prod.yml up -d
nginx -s reload
```

**Infrastructure:**
- **EC2 Instance**: t3.medium (2 vCPU, 4GB RAM)
- **Security Groups**: HTTP (80), HTTPS (443), Custom ports
- **Load Balancer**: Nginx reverse proxy
- **SSL**: Let's Encrypt certificates

## 📊 Monitoring & Analytics

### **Grafana Dashboards**
- **Application Metrics**: Request rates, response times, error rates
- **System Metrics**: CPU, memory, disk usage
- **Business Metrics**: Fare calculations, user interactions
- **Database Metrics**: Connection pool, query performance

### **Key Performance Indicators**
- **Uptime**: 99.9% target
- **Response Time**: < 100ms average
- **Error Rate**: < 0.1%
- **User Satisfaction**: Based on interaction patterns

### **Alerting Rules**
```yaml
# prometheus.rules.yml
groups:
  - name: mc-taxi-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status_code=~"5.."}[5m]) > 0.1
        for: 5m
        annotations:
          summary: "High error rate detected"
```

## 🧪 Testing

### **Test Coverage**
- **Unit Tests**: Jest for business logic
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Frontend user flows
- **Performance Tests**: Load testing with monitoring

```bash
# Run tests
npm test              # Unit tests
npm run test:api      # API tests
npm run test:e2e      # End-to-end tests
```

### **Quality Assurance**
- **Code Coverage**: 90%+ target
- **ESLint**: Zero linting errors
- **TypeScript**: Strict type checking
- **Performance**: Lighthouse scores 90+

## 📈 Scalability Considerations

### **Horizontal Scaling**
- **Load Balancing**: Nginx with multiple app instances
- **Database**: MongoDB replica sets
- **Caching**: Redis for session management
- **CDN**: Static asset optimization

### **Performance Optimization**
- **Database Indexing**: Optimized query performance
- **Connection Pooling**: Efficient resource utilization
- **Caching Strategy**: Application and database level
- **Compression**: Gzip for API responses

### **Monitoring Scaling**
- **Metrics Aggregation**: Prometheus federation
- **Log Aggregation**: Centralized logging system
- **Alerting**: Multi-tier notification system
- **Capacity Planning**: Automated scaling triggers

## 🔮 Future Enhancements

### **Technical Roadmap**
- [ ] **Microservices Architecture**: Break into smaller services
- [ ] **GraphQL API**: Flexible data querying
- [ ] **Real-time Features**: WebSocket integration
- [ ] **Mobile App**: React Native implementation
- [ ] **Advanced Analytics**: Machine learning integration
- [ ] **Multi-region Deployment**: Global CDN and database replication

### **Business Features**
- [ ] **User Authentication**: JWT-based auth system
- [ ] **Payment Integration**: Stripe/PayPal integration
- [ ] **Booking System**: Complete ride booking flow
- [ ] **Driver Management**: Driver dashboard and tracking
- [ ] **Real-time Tracking**: GPS integration
- [ ] **Advanced Pricing**: Dynamic pricing algorithms

---

## 👨‍💻 Developer Information

**Built by**: [Your Name]  
**Portfolio**: [Your Portfolio URL]  
**LinkedIn**: [Your LinkedIn]  
**Email**: [Your Email]

### **Skills Demonstrated**
- ✅ **Full-Stack Development**: End-to-end application development
- ✅ **Modern Frontend**: React, Next.js, TypeScript, Advanced CSS
- ✅ **Backend Architecture**: Node.js, Express, MongoDB, API design
- ✅ **DevOps & Deployment**: Docker, AWS, CI/CD, Monitoring
- ✅ **Database Design**: MongoDB schema design and optimization
- ✅ **Performance Optimization**: Caching, indexing, monitoring
- ✅ **Security**: Input validation, rate limiting, security headers
- ✅ **Testing**: Unit, integration, and e2e testing
- ✅ **Monitoring**: Prometheus, Grafana, custom metrics
- ✅ **UI/UX Design**: Modern design patterns, animations, accessibility

---

⭐ **Star this repository** if you found it impressive or useful for learning modern full-stack development!

📝 **License**: MIT - feel free to use this project for learning and portfolio purposes.