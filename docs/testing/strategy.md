# OpenPLM — Testing Strategy

## Purpose
Defines the testing approach for OpenPLM across unit, integration, and end-to-end levels.

---

## 1. Testing Pyramid

```
         ┌─────────┐
         │  E2E    │   Few, high-value scenarios
         ├─────────┤
         │ Integr. │   API → Service → Database
         ├─────────┤
         │  Unit   │   Domain logic, algorithms, validation
         └─────────┘   Many, fast, isolated
```

---

## 2. Unit Tests (Vitest)

**Focus areas:**
- Lifecycle state machine transitions (valid + invalid)
- Revision logic (numbering, display codes, immutability)
- BOM comparison algorithm
- BOM validation rules (quantity, structure)
- Dependency validation (self-ref, duplicates, cycles)
- Graph algorithms: BFS, DFS, cycle detection, topological sort
- Impact analysis classification and rules
- Workflow transition logic
- Zod validation schemas

**Characteristics:**
- No database, no HTTP, no external dependencies
- Fast execution (< 1 second per test)
- Comprehensive edge cases

---

## 3. Integration Tests (Vitest + Supertest)

**Focus areas:**
- API endpoint testing (request → response)
- Application service → database flows
- Authentication/authorization middleware
- Error handling and response format

**Examples:**
- `POST /api/v1/products` creates a product and returns it
- `POST /api/v1/products/:id/revisions` creates a revision
- `POST /api/v1/change-requests/:id/approve` rejects without impact analysis
- Unauthorized requests return 401/403

**Characteristics:**
- Use Supertest to make HTTP requests to Express app
- Database may be real (Testcontainers) or mocked per test needs
- Test the full API layer stack

---

## 4. End-to-End Tests (Playwright)

**Focus areas:**
- Golden scenario: login → create product → build BOM → create change → impact analysis → approve → release
- Critical user workflows

**Characteristics:**
- Browser-based tests against running frontend + backend + database
- Slow but high confidence
- Minimum one complete golden scenario

---

## 5. Edge Cases to Cover

### Revisions
- Duplicate revision number
- Modify released revision → rejected
- Invalid lifecycle transition → rejected
- Concurrent revision creation

### BOM
- Zero quantity → rejected
- Negative quantity → rejected
- Missing component reference → rejected
- Invalid parent → rejected
- Circular nesting → rejected
- Modify released BOM → rejected

### Dependencies
- Self-dependency → rejected
- Duplicate dependency → rejected
- Missing source entity → rejected
- Missing target entity → rejected
- Cyclic dependency → rejected
- Disconnected graph handling

### Changes
- Approve without impact analysis → rejected
- Unauthorized approval → rejected
- Invalid workflow transition → rejected

### Impact Analysis
- No dependencies → empty impact
- Single-hop dependency
- Deep dependency chain
- Multiple paths to same node → no duplicate results
- Cycle in graph → handled gracefully
- Large graph performance

---

## 6. Tools

| Tool | Purpose |
|------|---------|
| Vitest | Unit and integration test runner |
| Supertest | HTTP request testing |
| Playwright | E2E browser testing |
| Testcontainers | Disposable PostgreSQL for integration tests |

---

## 7. CI Integration

```
Install → Lint → TypeCheck → Unit Tests → Integration Tests → Build
```

E2E tests run separately (require full environment).

---

## Document Status

| Field | Value |
|-------|-------|
| Milestone | M3 — Physical Architecture & Database Design |
| Status | COMPLETE |
| Last Updated | 2026-09-10 |
