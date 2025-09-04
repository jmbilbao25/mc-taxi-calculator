# 🚖 MC Taxi Calculator

A modern taxi fare calculator built with Next.js, Express.js, and PostgreSQL. Features real-time calculations, admin panel, and comprehensive monitoring.

[![Next.js](https://img.shields.io/badge/Next.js-14.2.13-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-AWS_RDS-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![AWS](https://img.shields.io/badge/AWS-EC2_RDS-orange?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue?style=for-the-badge&logo=docker)](https://www.docker.com/)

- **App**: http://35.74.250.160:3000
- **API**: http://35.74.250.160:3001
- **Admin**: http://35.74.250.160:3000/admin

## 🛠️ Tech Stack

**Frontend**: Next.js, TypeScript, React, Tailwind CSS, Framer Motion  
**Backend**: Node.js, Express.js, PostgreSQL  
**Infrastructure**: Docker, AWS EC2, AWS RDS  
**Monitoring**: Prometheus, Grafana

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp env.example .env

# Start with Docker
docker-compose -f docker-compose.simple-images.yml up
```

## 📱 API Endpoints

- `POST /api/calculate-fare` - Calculate taxi fare
- `GET /api/health` - Health check
- `GET /metrics` - Prometheus metrics
- `GET/POST/PUT /api/fare-config/*` - Fare configuration

## 🏗️ Architecture

```
Frontend (Next.js) → API (Express.js) → Database (PostgreSQL)
                             ↓
                    Monitoring (Prometheus + Grafana)
```

## ✨ Features

- Real-time fare calculations
- Admin panel for fare configuration
- Comprehensive monitoring with Grafana
- Responsive design with dark/light mode
- Rate limiting and security
- Docker containerization

## 📊 Monitoring

Access Grafana dashboards for real-time metrics on application performance, system health, and business metrics.

---

⭐ **Star this repo** if you find it useful!