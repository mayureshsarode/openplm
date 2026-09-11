# AGENTS.md — AI Development Governance for OpenPLM

## Project
OpenPLM — Engineering Product Lifecycle & Change Intelligence Platform

## Architecture
- Modular monolith (Node.js/Express backend, React frontend, PostgreSQL)
- Four layers: API → Application → Domain → Infrastructure
- Graph/analysis engine has NO dependencies on Prisma or Express
- REST API versioned at /api/v1/

## Rules for AI Assistants

### Before Making Changes
1. Read README.md, this file, and relevant docs/ before modifying code
2. Read existing module code and tests before changing them
3. Check for relevant ADRs in docs/architecture/decisions/

### Work Scope
4. Work ONLY on the currently approved task/issue
5. Do NOT simultaneously modify unrelated modules
6. Do NOT introduce speculative features not requested
7. Do NOT add technologies not in the approved stack (see docs/architecture/decisions/)

### Architecture Protection
8. STOP and ask the human owner before:
   - Changing any technology choice
   - Modifying database schema strategy
   - Altering domain rules (lifecycle, revision immutability, etc.)
   - Expanding project scope
   - Adding new external dependencies
   - Changing the layered architecture
9. Do NOT bypass domain rules for convenience
10. Do NOT duplicate business logic across layers
11. Do NOT put business logic in API routes/controllers

### Code Quality
12. Tests are part of implementation — a feature without tests is incomplete
13. Keep changes focused — no unrelated modifications in a task
14. Preserve existing tests and documentation
15. All code must pass: lint, typecheck, build, tests
16. Follow existing code patterns and conventions

### Approved Technology Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL 16 + Prisma
- Validation: Zod
- Auth: JWT + RBAC
- Testing: Vitest + Supertest + Playwright
- DO NOT add: Redis, Kafka, GraphQL, MongoDB, graph databases, microservices, Spring Boot

### Commit Style
```
feat(module): description
fix(module): description
test(module): description
docs(section): description
```

### Reporting
After completing a task, report:
- What was implemented
- Files changed
- Tests added/run
- Lint/typecheck/build results
- Architecture decisions made
- Concerns requiring human approval
- Next suggested task
