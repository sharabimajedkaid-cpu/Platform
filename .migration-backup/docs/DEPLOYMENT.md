# Britishce44 Deployment Guide

## Prerequisites

- Node.js 20+ 
- Docker & Docker Compose
- Kubernetes (for production)
- Helm (for K8s deployments)
- Terraform (for IaC)

## Quick Start (Development)

```bash
# Install dependencies
npm install

# Start all services (development mode)
npm run dev

# Start individual services
npm run dev:api-gateway
npm run dev:auth
npm run dev:classroom
npm run dev:lms
npm run dev:messaging
npm run dev:ai

# Start frontend
npm run dev:web
```

## Docker Deployment

```bash
# Build all services
npm run docker:build

# Start all containers
npm run docker:up

# Stop all containers
npm run docker:down
```

## Kubernetes Deployment

```bash
# Create namespace
kubectl apply -f infrastructure/kubernetes/namespace.yml

# Deploy secrets first
kubectl apply -f infrastructure/kubernetes/secrets.yml

# Deploy all services
kubectl apply -f infrastructure/kubernetes/

# Check rollout status
kubectl rollout status deployment/api-gateway -n britishce44

# Access the platform
# Web: https://app.britishce44.edu
# API: https://api.britishce44.edu
```

## Environment Variables

Create a `.env` file in the root:

```env
NODE_ENV=production
JWT_SECRET=your-jwt-secret-here
DB_PASSWORD=your-db-password
REDIS_URL=redis://redis:6379
OPENAI_API_KEY=sk-...
LIVEKIT_API_KEY=...
LIVEKIT_API_SECRET=...
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=your-minio-password
SMTP_USER=your-email
SMTP_PASS=your-email-password
```

## Database Migration

```bash
# Run migrations
npm run migrate

# Seed initial data
npm run seed
```

## Monitoring

Access the monitoring stack:
- Grafana: http://localhost:3000 (admin/admin)
- Prometheus: http://localhost:9090
- Kibana: http://localhost:5601

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | britishce44@gmail.com | admin123 |
| Supervisor | supervisor@britishce44.edu | supervisor123 |
| Teacher | suhair.almojahid@britishce44.edu | teacher123 |
| Teacher | waad.alhammadi@britishce44.edu | teacher123 |
| Teacher | jamal.alshameeri@britishce44.edu | teacher123 |
| Teacher | amani.alsharabi@britishce44.edu | teacher123 |
| Teacher | khadeejah.alghaily@britishce44.edu | teacher123 |
| Teacher | shihab.alomary@britishce44.edu | teacher123 |
| Student | student1@britishce44.edu | student123 |
