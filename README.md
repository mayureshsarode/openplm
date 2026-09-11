# OpenPLM — Engineering Product Lifecycle & Change Intelligence Platform

> A focused engineering lifecycle platform for managing product structures, requirements, revisions, dependencies, and engineering changes with automated change-impact analysis and workflow-driven approval.

## Core Differentiator

**Understand what a change affects before approving it.**

OpenPLM's primary feature is **change impact analysis** over an engineering relationship/dependency graph. When a change is proposed, the system automatically discovers directly affected components, indirectly affected assemblies, and traced requirements — all before the change is approved.

## Technology Stack

| Area | Technology |
|------|-----------|
| Frontend | React + TypeScript + Vite + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL 16 |
| ORM | Prisma |
| API | REST (OpenAPI documented) |
| Validation | Zod |
| Auth | JWT + Refresh Tokens + RBAC |
| Testing | Vitest + Supertest + Playwright |
| Containers | Docker + Docker Compose |
| CI | GitHub Actions |

## Project Structure

```
openplm/
├── apps/
│   ├── backend/          # Express API server
│   └── frontend/         # React SPA
├── packages/
│   └── shared/           # Shared TypeScript types
├── docs/                 # Project documentation
│   ├── requirements/     # SRS, FRs, NFRs, user stories
│   ├── domain/           # Domain model, terminology
│   ├── architecture/     # System architecture, ADRs
│   ├── algorithms/       # Graph engine, impact analysis
│   ├── testing/          # Strategy, test plan
│   └── deployment/       # Setup guides
├── infra/                # Infrastructure configs
├── scripts/              # Development scripts
├── .github/              # CI workflows, templates
├── docker-compose.yml    # PostgreSQL setup
└── package.json          # Root workspace
```

## Quick Start

### Prerequisites
- Node.js 20 LTS
- Docker & Docker Compose
- Git

### Setup
```bash
# Clone and install
git clone https://github.com/mayureshsarode/openplm.git
cd openplm
npm install

# Start PostgreSQL
docker compose up -d

# Configure backend
cp apps/backend/.env.example apps/backend/.env

# Validate Prisma schema (migrations begin in M5)
cd apps/backend && npx prisma validate && cd ../..

# Start development servers (from root or via workspaces)
npm run dev:backend
npm run dev:frontend
```

### Verify
```bash
curl http://localhost:3000/api/v1/health
# {"status":"ok"}
```

## Development

```bash
# Run all tests
npm test --workspaces

# Lint
npm run lint --workspaces

# Type check
npm run typecheck --workspaces

# Build
npm run build --workspaces
```

## Demo Product

**SAC-001 — Smart Access Control System** with facial authentication, including components (Main Controller, Camera Assembly, Sensors), requirements, dependencies, and a full change management workflow.

## Documentation

- [Software Requirements Specification](docs/requirements/SRS.md)
- [Domain Model](docs/domain/domain-model.md)
- [System Architecture](docs/architecture/system-architecture.md)
- [API Design](docs/architecture/api-design.md)
- [Database Design](docs/architecture/database-design.md)
- [Testing Strategy](docs/testing/strategy.md)
- [Local Development](docs/deployment/local-development.md)
- [Architecture Decisions](docs/architecture/decisions/)

## Architecture

OpenPLM uses a **modular monolith** architecture with four layers:

1. **API Layer** — Routes, middleware, validation (Express + Zod)
2. **Application Layer** — Use case orchestration
3. **Domain Layer** — Business rules, lifecycle, graph algorithms, impact analysis
4. **Infrastructure Layer** — Prisma, PostgreSQL, logging, auth

## Project Roadmap

| Milestone | Description | Status |
|-----------|-------------|--------|
| M0 | Domain Discovery | ✅ Complete |
| M1 | Requirements Engineering | ✅ Complete |
| M2 | Domain & System Design | ✅ Complete |
| M3 | Physical Architecture & DB Design | ✅ Complete |
| M4 | Repository & Engineering Foundation | ✅ Complete |
| M5 | Database & Backend Foundation | Planned |
| M6 | Product, Component & Revision | Planned |
| M7 | BOM Management | Planned |
| M8 | Requirements & Traceability | Planned |
| M9 | Dependency & Graph Engine | Planned |
| M10 | BOM Comparison & Impact Analysis | Planned |
| M11 | Engineering Change & Workflow | Planned |
| M12 | Search, Documents & Release | Planned |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

[MIT](LICENSE)
