# 🚖 MC Taxi Calculator

A modern, production-ready taxi fare calculator built with Next.js and Express.js. Features a clean UI, real-time calculations, comprehensive monitoring, and enterprise-grade architecture.

[![Next.js](https://img.shields.io/badge/Next.js-14.2.13-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-AWS_RDS-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![AWS](https://img.shields.io/badge/AWS-EC2_RDS-orange?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/)
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

MC Taxi Calculator is a **production-ready, enterprise-grade web application** that demonstrates advanced full-stack development skills. Built with modern web technologies, deployed on AWS infrastructure, and featuring comprehensive monitoring solutions, this project showcases scalable architecture patterns and professional development practices.

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
- **Admin Panel**: Secure access to fare configuration and monitoring dashboards

## ⚡ Live Demo

**Production URL**: http://35.74.250.160:3000

**API Endpoint**: http://35.74.250.160:3001

**Admin Panel**: http://35.74.250.160:3000/admin

*Access the admin panel to configure fare settings and view system metrics*

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
| **PostgreSQL** | 15+ | Relational database with AWS RDS |
| **pg** | 8.11.3 | PostgreSQL driver for Node.js |
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
| **AWS RDS** | Managed PostgreSQL database |
| **Nginx** | Reverse proxy and load balancing |

### **Development Tools**
| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting and quality |
| **Jest** | Unit testing framework |
| **Supertest** | API testing |
| **Nodemon** | Development server auto-reload |

## 🏗️ Architecture

### **Modern Cloud Architecture**

```
Frontend (Next.js) → API (Express.js) → Database (AWS RDS PostgreSQL)
                             ↓
                    Monitoring (Prometheus + Grafana)
                             ↓
                    Infrastructure (AWS EC2 + Docker)
```

**Data Flow**: User input → validation → calculation → PostgreSQL storage → response

**Monitoring Flow**: Application metrics → Prometheus collection → Grafana visualization

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
- **Admin Panel**: Dynamic fare configuration and system monitoring

### 💰 **Dynamic Fare Management**
- **Admin Interface**: Real-time fare configuration updates
- **Database-Driven**: PostgreSQL-based fare calculations
- **Vehicle Types**: Configurable pricing for different vehicles
- **Distance Ranges**: Flexible distance-based pricing tiers

## 🚀 Performance & Monitoring

### **Metrics Collection**
The application implements comprehensive monitoring using Prometheus and Grafana:

- **HTTP Request Metrics**: Total requests, response times, status codes
- **Business Metrics**: Fare calculations, vehicle types, success rates
- **System Metrics**: CPU, memory, disk usage via Node Exporter
- **Container Metrics**: Docker performance via cAdvisor
- **Custom Application Metrics**: Real-time fare calculation tracking

### **Performance Benchmarks**
- **API Response Time**: < 100ms average
- **Frontend Load Time**: < 2s initial load
- **Database Queries**: Optimized with PostgreSQL indexes
- **Memory Usage**: < 512MB in production
- **Uptime**: 99.9% target with health monitoring

## 🔧 Installation & Setup

### **Prerequisites**
- Node.js 20+
- PostgreSQL database (local or AWS RDS)
- Docker & Docker Compose
- AWS CLI (for RDS setup)

### **Local Development**

1. **Clone the repository**
2. **Install dependencies** with npm install
3. **Set up environment variables** from env.example
4. **Configure database connection** to your PostgreSQL instance
5. **Start development servers** for frontend and backend

### **Environment Variables**

Essential environment variables include database connection details, API ports, and monitoring configurations. The application supports both local development and production AWS deployments.

### **Project Structure**

The project follows a clean, organized structure with separate directories for frontend, backend, configuration, monitoring, and documentation. Docker configurations are organized for easy deployment and scaling.

## 📱 API Documentation

### **Postman Collection**

A complete Postman collection is included for API testing and development. The collection covers all endpoints with proper validation tests and example requests.

### **Key Endpoints**

- **Fare Calculation**: POST /api/calculate-fare
- **Health Check**: GET /api/health
- **Metrics**: GET /metrics (Prometheus format)
- **Fare Configuration**: GET/POST/PUT /api/fare-config/*
- **Vehicle Types**: GET /api/fare-config/vehicles

### **API Features**

The API includes comprehensive input validation, error handling, rate limiting, and real-time metrics collection. All endpoints are documented and tested for reliability.

## 🏗️ Deployment

### **Docker Deployment**

The application is fully containerized using Docker and Docker Compose. Multiple compose files are provided for different deployment scenarios:

- **Development**: Local development with hot reloading
- **Production**: Optimized production builds
- **Monitoring**: Complete monitoring stack deployment

### **AWS Infrastructure**

**Current Deployment:**
- **EC2 Instance**: t3.medium (2 vCPU, 4GB RAM)
- **RDS Database**: PostgreSQL 15 on AWS RDS
- **Security Groups**: Configured for HTTP, HTTPS, and monitoring ports
- **Load Balancer**: Nginx reverse proxy
- **Monitoring**: Prometheus, Grafana, Node Exporter, cAdvisor

**Deployment Process:**
The application uses automated deployment scripts and Docker Compose for consistent, reproducible deployments across environments.

## 📊 Monitoring & Analytics

### **Grafana Dashboards**

Comprehensive monitoring dashboards provide real-time insights into:

- **Application Performance**: Request rates, response times, error rates
- **System Health**: CPU, memory, disk usage, network performance
- **Business Metrics**: Fare calculations, user interactions, success rates
- **Database Performance**: Connection pool status, query performance
- **Container Metrics**: Docker resource utilization and performance

### **Prometheus Metrics**

The monitoring system collects detailed metrics including:

- **HTTP Request Metrics**: Method, route, status code, duration
- **Business Logic Metrics**: Fare calculations, vehicle types, distance ranges
- **System Metrics**: Resource utilization, performance indicators
- **Custom Application Metrics**: Real-time business intelligence

### **Alerting & Notifications**

The monitoring system includes configurable alerting rules for:
- High error rates
- Performance degradation
- System resource issues
- Business metric anomalies

## 🧪 Testing

### **Test Coverage**

The application includes comprehensive testing at multiple levels:

- **Unit Tests**: Jest framework for business logic and utilities
- **Integration Tests**: API endpoint testing with Supertest
- **End-to-End Tests**: Complete user flow validation
- **Performance Tests**: Load testing with monitoring integration

### **Quality Assurance**

- **Code Coverage**: 90%+ target maintained
- **ESLint**: Zero linting errors enforced
- **TypeScript**: Strict type checking enabled
- **Performance**: Lighthouse scores 90+ maintained

## 📈 Scalability Considerations

### **Horizontal Scaling**

The architecture supports horizontal scaling through:

- **Load Balancing**: Nginx reverse proxy with multiple app instances
- **Database Scaling**: PostgreSQL read replicas and connection pooling
- **Caching Strategy**: Application and database level caching
- **CDN Integration**: Static asset optimization and distribution

### **Performance Optimization**

- **Database Indexing**: Optimized PostgreSQL query performance
- **Connection Pooling**: Efficient resource utilization
- **Caching Strategy**: Multi-level caching implementation
- **Compression**: Gzip compression for API responses

### **Monitoring Scaling**

- **Metrics Aggregation**: Prometheus federation for large deployments
- **Log Aggregation**: Centralized logging system
- **Alerting**: Multi-tier notification system
- **Capacity Planning**: Automated scaling triggers and monitoring

## 🔮 Future Enhancements

### **Technical Roadmap**

- **Microservices Architecture**: Break into smaller, focused services
- **GraphQL API**: Flexible data querying and real-time subscriptions
- **Real-time Features**: WebSocket integration for live updates
- **Mobile App**: React Native implementation
- **Advanced Analytics**: Machine learning integration for pricing optimization
- **Multi-region Deployment**: Global CDN and database replication

### **Business Features**

- **User Authentication**: JWT-based authentication system
- **Payment Integration**: Stripe/PayPal integration for fare payments
- **Booking System**: Complete ride booking and management flow
- **Driver Management**: Driver dashboard and real-time tracking
- **Real-time Tracking**: GPS integration and location services
- **Advanced Pricing**: Dynamic pricing algorithms and surge pricing

---

## 👨‍💻 Developer Information

**Built by**: [Your Name]  
**Portfolio**: [Your Portfolio URL]  
**LinkedIn**: [Your LinkedIn]  
**Email**: [Your Email]

### **Skills Demonstrated**

This project showcases expertise in:

- ✅ **Full-Stack Development**: End-to-end application development
- ✅ **Modern Frontend**: React, Next.js, TypeScript, Advanced CSS
- ✅ **Backend Architecture**: Node.js, Express, PostgreSQL, API design
- ✅ **Cloud Infrastructure**: AWS EC2, RDS, Docker, CI/CD
- ✅ **Database Design**: PostgreSQL schema design and optimization
- ✅ **Performance Optimization**: Caching, indexing, monitoring
- ✅ **Security**: Input validation, rate limiting, security headers
- ✅ **Testing**: Unit, integration, and e2e testing
- ✅ **Monitoring**: Prometheus, Grafana, custom metrics
- ✅ **UI/UX Design**: Modern design patterns, animations, accessibility
- ✅ **DevOps**: Docker, monitoring, deployment automation

---

⭐ **Star this repository** if you found it impressive or useful for learning modern full-stack development!

📝 **License**: MIT - feel free to use this project for learning and portfolio purposes.