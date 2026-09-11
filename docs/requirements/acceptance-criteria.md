# OpenPLM — Acceptance Criteria

## Purpose
Acceptance criteria for each milestone, defining when a milestone is considered DONE.

---

## M4 — Repository & Engineering Foundation

- [x] GitHub repository initialized
- [x] Monorepo structure matches approved architecture
- [x] README.md exists with project overview and setup instructions
- [x] AGENTS.md exists with AI development governance rules
- [x] CONTRIBUTING.md exists with contribution guidelines
- [x] LICENSE file exists
- [x] .gitignore properly configured
- [x] Issue templates created
- [x] PR template created
- [x] Frontend starts locally (React + Vite + Tailwind)
- [x] Backend starts locally (Express + TypeScript)
- [x] PostgreSQL starts through Docker Compose
- [x] Prisma connects to PostgreSQL successfully
- [x] Environment configuration works (.env)
- [x] Health endpoint `GET /api/v1/health` returns `{"status":"ok"}`
- [x] Vitest test framework runs and passes
- [x] ESLint passes (backend + frontend)
- [x] TypeScript strict checks pass
- [x] Frontend builds successfully
- [x] Backend builds successfully
- [x] GitHub Actions CI workflow configured
- [x] No unnecessary dependencies
- [x] Initial commit is clean and focused

---

## M5 — Database & Backend Foundation

- [ ] Prisma schema implements approved domain model
- [ ] Initial migration created and applied
- [ ] Seed strategy defined and working
- [ ] Database connection pooling configured
- [ ] Application configuration validated with Zod
- [ ] Centralized error handling with consistent error model
- [ ] Structured logging (Winston) operational
- [ ] Zod validation infrastructure in place
- [ ] Authentication (JWT + refresh token) working
- [ ] Authorization (RBAC) middleware working
- [ ] API router foundation with versioning (/api/v1/*)
- [ ] Test foundation with Supertest integration tests
- [ ] All tests pass, lint clean, build succeeds

---

## M6 — Product, Component & Revision Management

- [ ] Product CRUD API operational
- [ ] Component CRUD API operational
- [ ] Product revision creation working
- [ ] Component revision creation working
- [ ] Lifecycle state machine enforcing valid transitions
- [ ] Invalid transitions rejected with proper errors
- [ ] Released revisions are immutable
- [ ] Revision numbering (numeric + display code) working
- [ ] Product listing and detail views in frontend
- [ ] Component listing and detail views in frontend
- [ ] Audit events: PRODUCT_CREATED, REVISION_CREATED
- [ ] Unit tests for lifecycle state machine
- [ ] Integration tests for product/component APIs
- [ ] All tests pass, lint clean, build succeeds

---

## M7 — BOM Management

- [ ] BOM creation for product revision working
- [ ] BOM item CRUD with component revision reference
- [ ] Nested BOM items (parent-child) supported
- [ ] Quantity validation (> 0) enforced
- [ ] BOM immutability for released revisions enforced
- [ ] BOM displayed as hierarchical tree in frontend
- [ ] BOM comparison (ADDED, REMOVED, MODIFIED, UNCHANGED)
- [ ] Audit events: BOM_MODIFIED
- [ ] Unit tests for BOM validation and comparison
- [ ] Integration tests for BOM API
- [ ] All tests pass, lint clean, build succeeds

---

## M8 — Requirements & Traceability

- [ ] Requirement CRUD with unique numbers
- [ ] Requirement revisions working
- [ ] Requirement lifecycle enforced
- [ ] Requirement-to-product links working
- [ ] Requirement-to-component links working
- [ ] Traceability view in frontend
- [ ] Audit events recorded
- [ ] Tests covering traceability links
- [ ] All tests pass, lint clean, build succeeds

---

## M9 — Dependency & Graph Engine

- [ ] Graph abstraction module (no Prisma/Express dependency)
- [ ] BFS algorithm implemented and tested
- [ ] DFS algorithm implemented and tested
- [ ] Cycle detection implemented and tested
- [ ] Topological sort implemented and tested
- [ ] Dependency CRUD API working
- [ ] Self-dependency prevention
- [ ] Duplicate dependency prevention
- [ ] Entity existence validation
- [ ] Dependency visualization in frontend
- [ ] Edge-case tests (empty graph, disconnected, large graph)
- [ ] All tests pass, lint clean, build succeeds

---

## M10 — BOM Comparison & Impact Analysis

- [ ] BOM comparator: normalize, match, classify
- [ ] Impact analyzer: graph traversal from changed entities
- [ ] Impact types: DIRECT, INDIRECT, TRACEABILITY
- [ ] Impact depth tracked per result
- [ ] Risk assessment separate from depth
- [ ] Impact analysis persisted with version and algorithm info
- [ ] Impact report UI with clear categorization
- [ ] Performance baseline documented
- [ ] Comprehensive algorithm tests
- [ ] All tests pass, lint clean, build succeeds

---

## M11 — Engineering Change & Workflow

- [ ] Change request CRUD with unique numbers
- [ ] Change items management
- [ ] Change lifecycle enforcement
- [ ] Workflow definition CRUD
- [ ] Workflow instance creation
- [ ] Task assignment and management
- [ ] Reviewer approve/reject flow
- [ ] Implementation and verification workflow
- [ ] Release workflow
- [ ] Audit events for all change actions
- [ ] Integration tests for complete change flow
- [ ] All tests pass, lint clean, build succeeds

---

## M12 — Search, Documents, Hardening & Release

- [ ] Global search across entity types
- [ ] Document metadata and revision management
- [ ] Security hardening review complete
- [ ] Complete test suite passing
- [ ] E2E golden scenario test passing
- [ ] Performance testing completed
- [ ] Docker production setup
- [ ] GitHub Actions CI/CD complete
- [ ] Demo dataset (SAC-001) loaded
- [ ] Final README and architecture diagrams
- [ ] v1.0 release tag

---

## Document Status
 
| Field | Value |
|-------|-------|
| Milestone | M4 — Repository & Engineering Foundation |
| Status | COMPLETE |
| Last Updated | 2026-09-11 |
