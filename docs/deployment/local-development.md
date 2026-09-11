# OpenPLM — Local Development Setup

## Prerequisites

- **Node.js** 20 LTS or later
- **npm** 10 or later
- **Docker** and **Docker Compose**
- **Git**

---

## Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/mayureshsarode/openplm.git
cd openplm
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start PostgreSQL
```bash
docker compose up -d
```

This starts PostgreSQL 16 on port 5432.

### 4. Configure environment
```bash
cp apps/backend/.env.example apps/backend/.env
```

Edit `.env` with your local configuration. Default values work with the Docker Compose setup.

### 5. Validate Prisma schema
```bash
cd apps/backend
npx prisma validate
```

> **Note:** Database migrations and the full entity schema will be created and applied starting in M5. In M4, Prisma is initialized and validated for configuration and database connectivity.

### 6. Start the backend
```bash
cd apps/backend
npm run dev
```

Backend starts on `http://localhost:3000`.

### 7. Start the frontend
```bash
cd apps/frontend
npm run dev
```

Frontend starts on `http://localhost:5173`.

### 8. Verify
```bash
curl http://localhost:3000/api/v1/health
# Expected: {"status":"ok"}
```

---

## Common Commands

| Command | Location | Description |
|---------|----------|-------------|
| `npm install` | Root | Install all workspace dependencies |
| `npm run dev` | apps/backend | Start backend dev server |
| `npm run dev` | apps/frontend | Start frontend dev server |
| `npm test` | apps/backend | Run backend tests |
| `npm run lint` | apps/backend | Lint backend code |
| `npm run lint` | apps/frontend | Lint frontend code |
| `npm run build` | apps/backend | Build backend |
| `npm run build` | apps/frontend | Build frontend |
| `docker compose up -d` | Root | Start PostgreSQL |
| `docker compose down` | Root | Stop PostgreSQL |
| `npx prisma validate` | apps/backend | Validate Prisma schema |
| `npx prisma migrate dev` | apps/backend | Apply database migrations (starting in M5) |
| `npx prisma studio` | apps/backend | Open Prisma database viewer |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Backend server port |
| DATABASE_URL | postgresql://openplm:openplm@localhost:5432/openplm | PostgreSQL connection |
| JWT_SECRET | (required) | Secret key for JWT signing |
| JWT_EXPIRES_IN | 15m | Access token expiration |
| REFRESH_TOKEN_EXPIRES_IN | 7d | Refresh token expiration |
| NODE_ENV | development | Environment mode |
| CORS_ORIGIN | http://localhost:5173 | Allowed CORS origin |

---

## Docker Compose Services

| Service | Port | Description |
|---------|------|-------------|
| postgres | 5432 | PostgreSQL 16 database |

---

## Troubleshooting

**PostgreSQL won't start:**
- Check if port 5432 is already in use: `lsof -i :5432` (Mac/Linux) or `netstat -an | findstr 5432` (Windows)
- Check Docker is running: `docker info`

**Prisma connection fails:**
- Verify DATABASE_URL in `.env`
- Verify PostgreSQL is healthy: `docker compose ps`

**npm install fails:**
- Ensure Node.js 20+ is installed: `node --version`
- Clear npm cache: `npm cache clean --force`

---

## Document Status

| Field | Value |
|-------|-------|
| Milestone | M4 — Repository & Engineering Foundation |
| Status | COMPLETE |
| Last Updated | 2026-09-11 |
