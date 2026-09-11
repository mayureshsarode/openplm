# OpenPLM — System Architecture

## Purpose
Defines the approved system architecture for OpenPLM v1, including layers, module boundaries, data flow, and technology mapping.

---

## 1. Architecture Pattern: Modular Monolith

OpenPLM v1 uses a **modular monolith** architecture. See [ADR-001](./decisions/ADR-001-modular-monolith.md).

**Why modular monolith:**
- Clear internal module boundaries without distributed-system complexity
- Simpler deployment, debugging, and transaction management
- Sufficient for current scale requirements
- Can be decomposed into services later if justified

**What this means:**
- Single deployable backend application
- Logical module boundaries enforced by directory structure and imports
- No inter-service communication overhead
- Shared database with clear ownership per module

---

## 2. System Overview

```
┌─────────────────────────────────────────────┐
│              React Frontend                  │
│  (TypeScript + Vite + Tailwind CSS)         │
│  Features: Products, BOM, Requirements,     │
│  Dependencies, Changes, Impact, Workflows   │
└──────────────────┬──────────────────────────┘
                   │ HTTP/REST
                   ▼
┌─────────────────────────────────────────────┐
│           Node.js Backend                    │
│        (Express + TypeScript)               │
├─────────────────────────────────────────────┤
│  API Layer                                   │
│  ├── Routes & Controllers                   │
│  ├── Authentication Middleware (JWT)        │
│  ├── Authorization Middleware (RBAC)        │
│  ├── Request Validation (Zod)              │
│  └── Response Formatting                    │
├─────────────────────────────────────────────┤
│  Application Layer                           │
│  ├── Use Case Services                      │
│  ├── Orchestration Logic                    │
│  └── Transaction Coordination              │
├─────────────────────────────────────────────┤
│  Domain Layer                                │
│  ├── Lifecycle State Machine                │
│  ├── Revision Rules                         │
│  ├── BOM Validation                         │
│  ├── Dependency Validation                  │
│  ├── Graph Engine                           │
│  ├── Impact Analysis Engine                 │
│  ├── BOM Comparator                         │
│  ├── Workflow Rules                         │
│  └── Engineering Invariants                 │
├─────────────────────────────────────────────┤
│  Infrastructure Layer                        │
│  ├── Prisma ORM                             │
│  ├── Database Repositories                  │
│  ├── Configuration                          │
│  ├── Logging (Winston)                      │
│  └── Auth Implementation                    │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│              PostgreSQL 16                   │
│         (Docker Compose)                    │
└─────────────────────────────────────────────┘
```

---

## 3. Layer Responsibilities

### API Layer
| Responsibility | Example |
|----------------|---------|
| Routing | `POST /api/v1/products` |
| HTTP request/response | Parse body, set status codes |
| Authentication middleware | Validate JWT, extract identity |
| Authorization middleware | Check RBAC permissions |
| Request validation | Zod schemas for input |
| Response formatting | Consistent JSON envelope |
| Error formatting | Consistent error model |

**Must NOT** contain core engineering business logic.

### Application Layer
| Responsibility | Example |
|----------------|---------|
| Use-case orchestration | `CreateProduct`, `RunImpactAnalysis` |
| Transaction coordination | Wrap multi-write operations |
| Cross-module coordination | Change → Impact → Workflow |
| Permission pre-checks | Verify user can perform action |

**Use cases:**
- CreateProduct
- CreateRevision
- AddBOMItem
- CreateRequirement
- CreateDependency
- CreateChangeRequest
- RunImpactAnalysis
- SubmitChange
- ApproveChange
- RejectChange
- ReleaseRevision

### Domain Layer
| Responsibility | Example |
|----------------|---------|
| Lifecycle state machines | Valid transition matrix |
| Revision rules | Immutability enforcement |
| BOM validation | Quantity > 0, valid structure |
| Dependency validation | No self-refs, no cycles |
| Graph construction | Build traversable graph |
| Graph algorithms | BFS, DFS, cycle detection, topological sort |
| BOM comparison | Added/removed/modified/unchanged |
| Impact analysis | Traverse and classify affected entities |
| Workflow rules | Valid state transitions |
| Engineering invariants | Business rules enforcement |

**Must NOT** depend on Express, Prisma, or HTTP concepts.

### Infrastructure Layer
| Responsibility | Example |
|----------------|---------|
| Prisma client | Database access |
| Repository implementations | CRUD operations |
| Configuration | Environment variable loading |
| Logging | Structured logging with Winston |
| Auth implementation | JWT signing, bcrypt hashing |
| External services | Future integrations |

---

## 4. Module Structure

### Backend (`apps/backend/src/`)

```
src/
├── index.ts                    # Entry point
├── app.ts                      # Express app factory
├── config/                     # Environment config
├── api/
│   └── v1/
│       ├── router.ts           # v1 API router
│       ├── health.router.ts
│       ├── auth.router.ts
│       ├── products.router.ts
│       ├── components.router.ts
│       ├── boms.router.ts
│       ├── requirements.router.ts
│       ├── dependencies.router.ts
│       ├── change-requests.router.ts
│       ├── impact-analyses.router.ts
│       ├── workflows.router.ts
│       ├── tasks.router.ts
│       ├── documents.router.ts
│       ├── search.router.ts
│       └── audit.router.ts
├── middleware/
│   ├── auth.ts
│   ├── rbac.ts
│   ├── request-id.ts
│   ├── error-handler.ts
│   └── validation.ts
├── application/
│   ├── products/
│   ├── components/
│   ├── bom/
│   ├── requirements/
│   ├── dependencies/
│   ├── changes/
│   ├── impact/
│   ├── workflows/
│   └── audit/
├── domain/
│   ├── lifecycle/
│   ├── revision/
│   ├── bom/
│   ├── dependency/
│   ├── change/
│   ├── workflow/
│   └── analysis-engine/
│       ├── graph/
│       │   ├── graph.ts
│       │   ├── node.ts
│       │   └── edge.ts
│       ├── algorithms/
│       │   ├── bfs.ts
│       │   ├── dfs.ts
│       │   ├── cycle-detection.ts
│       │   └── topological-sort.ts
│       ├── bom/
│       │   └── bom-comparator.ts
│       └── impact/
│           ├── impact-analyzer.ts
│           ├── impact-result.ts
│           └── impact-rules.ts
├── infrastructure/
│   ├── database/
│   │   ├── prisma.ts
│   │   └── repositories/
│   ├── auth/
│   ├── logging/
│   └── config/
├── utils/
│   └── logger.ts
└── __tests__/
```

### Frontend (`apps/frontend/src/`)

```
src/
├── main.tsx
├── App.tsx
├── app/                        # App shell, routing
├── features/
│   ├── auth/
│   ├── dashboard/
│   ├── products/
│   ├── components/
│   ├── bom/
│   ├── requirements/
│   ├── dependencies/
│   ├── changes/
│   ├── impact-analysis/
│   ├── workflows/
│   ├── tasks/
│   ├── documents/
│   └── search/
├── components/
│   ├── ui/
│   ├── tables/
│   ├── forms/
│   └── graphs/
├── services/                   # API client
├── hooks/                      # Custom React hooks
├── types/                      # TypeScript types
└── utils/
```

---

## 5. Data Flow

### Typical Request Flow
```
Client Request
    │
    ▼
Express Router
    │
    ▼
Auth Middleware (JWT validation)
    │
    ▼
RBAC Middleware (permission check)
    │
    ▼
Validation Middleware (Zod)
    │
    ▼
Route Handler
    │
    ▼
Application Service (use case)
    │
    ▼
Domain Logic (rules, validation)
    │
    ▼
Repository (Prisma)
    │
    ▼
PostgreSQL
    │
    ▼
Response formatting
    │
    ▼
Client Response
```

### Impact Analysis Flow
```
POST /api/v1/change-requests/:id/analyze-impact
    │
    ▼
Application Service: RunImpactAnalysis
    │
    ├── Load ChangeRequest + ChangeItems
    ├── Load Dependencies from DB
    ├── Load Traceability links from DB
    │
    ▼
Domain: AnalysisEngine
    │
    ├── Build Graph (nodes + edges)
    ├── Validate Graph (cycle check)
    ├── Traverse (BFS from changed entities)
    ├── Classify impacts (DIRECT, INDIRECT, TRACEABILITY)
    ├── Apply impact rules (risk assessment)
    │
    ▼
Infrastructure: Persist ImpactAnalysis + ImpactResults
    │
    ▼
Return Impact Report
```

---

## 6. Technology Mapping

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + Vite + Tailwind CSS |
| API | Express + Zod |
| Application | TypeScript services |
| Domain | Pure TypeScript (no framework dependencies) |
| Infrastructure | Prisma + PostgreSQL + Winston + JWT |
| Testing | Vitest + Supertest + Playwright |
| Tooling | ESLint + Prettier + Docker |
| CI | GitHub Actions |

---

## 7. API Versioning

All API routes are versioned under `/api/v1/`. This allows future API evolution without breaking existing clients.

---

## Document Status

| Field | Value |
|-------|-------|
| Milestone | M2 — Domain & System Design |
| Status | COMPLETE |
| Last Updated | 2026-09-10 |
