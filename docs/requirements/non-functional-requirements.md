# OpenPLM — Non-Functional Requirements

## Purpose
Non-functional requirements defining quality attributes for OpenPLM.

---

## NFR-PERF: Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-PERF-001 | API response time for simple CRUD operations | < 200ms (p95) |
| NFR-PERF-002 | API response time for list/search operations | < 500ms (p95) |
| NFR-PERF-003 | Impact analysis execution time for typical graphs (< 1000 nodes) | < 2 seconds |
| NFR-PERF-004 | BOM comparison execution time | < 1 second for BOMs with < 500 items |
| NFR-PERF-005 | BOM tree rendering time | < 1 second for < 500 items |
| NFR-PERF-006 | Avoid N+1 query patterns in all data access | Mandatory |
| NFR-PERF-007 | Support pagination for all list endpoints | Mandatory |
| NFR-PERF-008 | Database queries shall use appropriate indexes | Mandatory |

---

## NFR-SEC: Security

| ID | Requirement |
|----|-------------|
| NFR-SEC-001 | Passwords shall be hashed using bcrypt (or equivalent) — never stored in plaintext |
| NFR-SEC-002 | JWT tokens shall have configurable expiration |
| NFR-SEC-003 | Refresh tokens shall support rotation and revocation |
| NFR-SEC-004 | All API endpoints (except auth) shall require valid authentication |
| NFR-SEC-005 | Authorization shall be enforced server-side — never trust client-side only |
| NFR-SEC-006 | RBAC permissions shall be centralized, not scattered across controllers |
| NFR-SEC-007 | Secrets (JWT keys, DB credentials) shall not be committed to source control |
| NFR-SEC-008 | Input validation shall occur at API boundary using Zod |
| NFR-SEC-009 | SQL injection prevention via Prisma parameterized queries |
| NFR-SEC-010 | CORS shall be configured to allow only approved origins |
| NFR-SEC-011 | Security headers shall be set using Helmet middleware |

---

## NFR-USA: Usability

| ID | Requirement |
|----|-------------|
| NFR-USA-001 | The UI shall be responsive and work on desktop browsers (1280px+ width) |
| NFR-USA-002 | The UI shall organize views around user workflows, not database tables |
| NFR-USA-003 | Product workspace shall provide tabbed navigation: Overview, BOM, Requirements, Dependencies, Changes, Documents, History |
| NFR-USA-004 | Impact analysis results shall be presented visually with clear categorization (Direct, Indirect, Traceability) |
| NFR-USA-005 | Error messages shall be clear and actionable |
| NFR-USA-006 | Loading states shall be shown for async operations |

---

## NFR-REL: Reliability

| ID | Requirement |
|----|-------------|
| NFR-REL-001 | Multi-write operations shall use database transactions |
| NFR-REL-002 | Transaction boundaries shall be designed per use case (not arbitrary global wrapping) |
| NFR-REL-003 | The system shall return consistent error responses using the approved error model |
| NFR-REL-004 | The health endpoint shall verify database connectivity |
| NFR-REL-005 | Audit events shall be reliably recorded for all auditable actions |

---

## NFR-MAIN: Maintainability

| ID | Requirement |
|----|-------------|
| NFR-MAIN-001 | The codebase shall follow the modular monolith architecture with clear layer boundaries |
| NFR-MAIN-002 | Business logic shall reside in the domain/application layer, not in controllers or routes |
| NFR-MAIN-003 | The graph engine shall have no dependencies on Prisma or Express |
| NFR-MAIN-004 | TypeScript strict mode shall be enabled |
| NFR-MAIN-005 | ESLint and Prettier shall enforce consistent code style |
| NFR-MAIN-006 | All code shall pass lint and type checks before merge |
| NFR-MAIN-007 | Architecture Decision Records (ADRs) shall document significant decisions |
| NFR-MAIN-008 | Structured logging shall be used with consistent fields (timestamp, level, requestId, operation) |

---

## NFR-SCALE: Scalability

| ID | Requirement |
|----|-------------|
| NFR-SCALE-001 | The system shall support products with BOMs of up to 1000 items |
| NFR-SCALE-002 | The dependency graph shall support up to 10,000 nodes and 50,000 edges |
| NFR-SCALE-003 | The system shall support concurrent users (target: 50 simultaneous) |
| NFR-SCALE-004 | Database indexes shall be added based on actual access patterns, not speculatively |

---

## NFR-TEST: Testability

| ID | Requirement |
|----|-------------|
| NFR-TEST-001 | Unit test coverage for domain logic (lifecycle, revision, graph algorithms) shall be comprehensive |
| NFR-TEST-002 | Integration tests shall cover API → Application → Database flows |
| NFR-TEST-003 | At least one E2E test shall cover the complete golden scenario |
| NFR-TEST-004 | Tests shall include meaningful edge cases and failure scenarios |
| NFR-TEST-005 | CI pipeline shall run all tests on every PR |

---

## Document Status

| Field | Value |
|-------|-------|
| Milestone | M1 — Requirements Engineering |
| Status | COMPLETE |
| Last Updated | 2026-09-10 |
