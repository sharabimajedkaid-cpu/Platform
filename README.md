# Britishce44 — Ultimate AI Digital School Ecosystem

All-in-one educational platform: 40 WebRTC classrooms, LMS, AI assistant, charging, and enterprise infrastructure.

## Quick Start

### Prerequisites
- Node.js 20+, npm
- Docker Desktop
- Git

### Launch (Local)

```bash
# 1. Start Docker Desktop, then:
docker compose -f infrastructure/docker/docker-compose.yml up -d

# 2. Seed content (optional):
bash infrastructure/scripts/seed-data.sh
# or on Windows:
infrastructure\scripts\seed-data.bat

# 3. Open:
#    Frontend:     http://localhost:80
#    API Gateway:  http://localhost:3000
#    Swagger Docs: http://localhost:3000/api
#    MinIO Console: http://localhost:9001
```

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | britishce44@gmail.com | admin123 |
| Teacher | suhair.almojahid | teacher123 |
| Teacher | waad.alhammadi | teacher123 |
| Teacher | jamal.alshameeri | teacher123 |
| Teacher | amani.alsharabi | teacher123 |
| Teacher | khadeejah.alghaily | teacher123 |
| Teacher | shihab.alomary | teacher123 |
| Supervisor | supervisor@britishce44.edu | supervisor123 |

## Production Launch

```bash
# 1. Edit .env.production with your secrets:
#    - JWT_SECRET: 64-char random string
#    - DB_PASSWORD: strong password
#    - TURN_SECRET: random string
#    - OPENAI_API_KEY: your OpenAI key
#    - MEDIASOUP_ANNOUNCED_IP: server public IP

# 2. Copy to .env:
cp infrastructure/docker/.env.production infrastructure/docker/.env

# 3. Set up domain + SSL:
docker compose -f infrastructure/docker/caddy-compose.yml up -d
# Edit Caddyfile, replace DOMAIN_NAME with your domain

# 4. Deploy:
docker compose -f infrastructure/docker/docker-compose.yml up -d

# 5. Seed data:
bash infrastructure/scripts/seed-data.sh

# 6. Run WebRTC E2E tests (docs/webrtc-e2e-test-plan.md)
```

## AWS Deployment (Terraform)

```bash
cd infrastructure/terraform
terraform init
terraform plan -var="db_password=your_password"
terraform apply -var="db_password=your_password"
kubectl apply -f ../kubernetes/
```

## Architecture

```
                    ┌─────────────┐
                    │  Caddy/SSL   │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │      API Gateway :3000   │
              └────────────┬────────────┘
                           │
       ┌───────────────────┼───────────────────┐
       │                   │                   │
  ┌────┴────┐  ┌───────────┴──────────┐  ┌────┴────┐
  │ Auth    │  │ Classroom (MediaSoup) │  │ LMS     │
  │ :3001   │  │ :3002                 │  │ :3003   │
  └────┬────┘  └───────────┬──────────┘  └────┬────┘
       │                   │                   │
  ┌────┴────┐  ┌───────────┴──────────┐  ┌────┴────┐
  │ Messag. │  │  AI Orchestrator     │  │ ERP     │
  │ :3004   │  │  :3005               │  │ :3006   │
  └────┬────┘  └───────────┬──────────┘  └────┬────┘
       │                   │                   │
  ┌────┴────┐  ┌───────────┴──────────┐  ┌────┴────┐
  │Analytics│  │ Notification         │  │Record.  │
  │ :3007   │  │ :3008                │  │ :3009   │
  └────┬────┘  └───────────┬──────────┘  └────┬────┘
       │                   │                   │
  ┌────┴────┐  ┌───────────┴──────────┐
  │ Billing │  │ Search               │
  │ :3010   │  │ :3011                │
  └────┬────┘  └───────────┬──────────┘
       │                   │
  ┌────┴────────────────────┴───┐
  │    PostgreSQL / Redis / ES   │
  └──────────────────────────────┘

         ┌──────────────────┐
         │  Frontend (Next) │ :80
         └──────────────────┘
         ┌──────────────────┐
         │  Mobile (RN)     │
         └──────────────────┘
         ┌──────────────────┐
         │  Desktop (Elect) │
         └──────────────────┘
         ┌──────────────────┐
         │  coturn (TURN)   │
         └──────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | NestJS + TypeScript |
| Frontend | Next.js 14 + Tailwind + Framer Motion |
| Mobile | React Native |
| Desktop | Electron |
| WebRTC | mediasoup v3 + coturn |
| Databases | PostgreSQL + Redis + MongoDB + Elasticsearch |
| Storage | MinIO (S3-compatible) |
| AI | OpenAI API + Custom anti-cheat engine |
| Infra | Docker + K8s + Terraform (AWS) |
| CI/CD | GitHub Actions |
| Monitoring | Prometheus + Grafana |

## Key Features

- **40 WebRTC Classrooms** with mediasoup SFU — up to 12,000 concurrent streams
- **Real-time Whiteboard** with fabric.js — pen, shapes, text, AI assistant
- **Teacher Desktop** — mute all, spotlight, lock room, eject, screen share
- **Breakout Rooms** with audio zones and auto-close timer
- **Recording** with quality tiers (720p/1080p/4K), pause/resume, MinIO upload
- **Live Polls** with real-time bar chart results
- **AI Teaching Assistant** — Explain, Translate, Quiz, Activity, Game (Arabic/English)
- **AI Anti-Cheat** — 97% accuracy weighted risk scoring
- **AI Content Moderation** — real-time chat filtering
- **Adaptive Bitrate** — AI-driven RTT-based resolution adjustment
- **100 Exams** across 6 CEFR levels (A1-C2)
- **Billing** — Lite/Pro/Enterprise plans
- **PWA** — offline access to recordings and materials
- **RTL Support** — full Arabic language support
- **Offline Queue** — priority-sorted sync for mobile
- **TURN Server** — coturn with ephemeral HMAC credentials
- **ICE Restart** — transport recovery on network degradation
