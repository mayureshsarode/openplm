# OpenPLM — Software Requirements Specification (SRS)

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification defines the functional and non-functional requirements for OpenPLM — Engineering Product Lifecycle & Change Intelligence Platform.

### 1.2 Scope
OpenPLM is a web-based platform for managing engineering product structures, requirements, revisions, dependencies, and engineering changes. Its core capability is **automated change-impact analysis** over an engineering dependency graph with workflow-driven approval.

### 1.3 Definitions
See [terminology.md](../domain/terminology.md) for the canonical glossary.

### 1.4 References
- [Project Purpose](../domain/project-purpose.md)
- [Teamcenter Observations](../domain/teamcenter-observations.md)
- [Domain Model](../domain/domain-model.md)
- [System Architecture](../architecture/system-architecture.md)
- [Functional Requirements](./functional-requirements.md)
- [Non-Functional Requirements](./non-functional-requirements.md)
- [User Stories](./user-stories.md)
- [Use Cases](./use-cases.md)
- [Business Rules](./business-rules.md)
- [Golden Scenario](./golden-scenario.md)
- [Acceptance Criteria](./acceptance-criteria.md)

---

## 2. Overall Description

### 2.1 Product Perspective
OpenPLM is a standalone web application consisting of:
- A **React** single-page application (frontend)
- A **Node.js/Express** REST API (backend)
- A **PostgreSQL** database
- A dedicated **graph/analysis engine** for impact analysis

### 2.2 Product Functions
1. **Product & Component Management** — Create and manage products, components, and their revisions with lifecycle state control
2. **BOM Management** — Build and manage hierarchical bills of materials tied to product revisions
3. **Requirements Management** — Define requirements with traceability links to engineering objects
4. **Dependency Management** — Define directed relationships between engineering objects
5. **Change Management** — Create, review, approve, and implement engineering changes
6. **Impact Analysis** — Automatically discover affected objects when a change is proposed
7. **Workflow & Tasks** — Structured review and approval workflows with assigned tasks
8. **BOM Comparison** — Compare two BOM versions to identify differences
9. **Search** — Find engineering objects across the system
10. **Audit Trail** — Immutable history of significant state changes

### 2.3 User Classes
| User Class | Description | Access Level |
|------------|-------------|--------------|
| Administrator | System management, user/role administration | Full system access |
| Engineer | Create and manage engineering objects, run analyses | Create/edit/analyze |
| Reviewer | Review and approve/reject changes | Review/approve |
| Viewer | Read-only access | Read only |

### 2.4 Operating Environment
- Modern web browsers (Chrome, Firefox, Edge, Safari)
- Server: Node.js 20 LTS
- Database: PostgreSQL 16
- Containerized via Docker

### 2.5 Constraints
- Modular monolith architecture (no microservices)
- REST API only (no GraphQL)
- PostgreSQL only (no graph database, no MongoDB)
- See [ADR decisions](../architecture/decisions/) for full constraint list

### 2.6 Assumptions
- Users have modern web browsers
- PostgreSQL is available (via Docker or direct installation)
- Engineers understand basic PLM concepts (products, BOMs, revisions)

---

## 3. Requirements Summary

### 3.1 Functional Requirements
See [functional-requirements.md](./functional-requirements.md) for the complete FR list.

**Domains covered:**
- Authentication & Authorization (FR-AUTH-*)
- Product Management (FR-PROD-*)
- Component Management (FR-COMP-*)
- BOM Management (FR-BOM-*)
- Requirements Management (FR-REQ-*)
- Dependency Management (FR-DEP-*)
- Change Management (FR-CHG-*)
- Impact Analysis (FR-IMP-*)
- Workflow & Tasks (FR-WF-*)
- Search (FR-SRCH-*)
- Audit (FR-AUD-*)
- Documents (FR-DOC-*)

### 3.2 Non-Functional Requirements
See [non-functional-requirements.md](./non-functional-requirements.md).

**Categories:** Performance, Security, Usability, Reliability, Maintainability, Scalability.

### 3.3 Business Rules
See [business-rules.md](./business-rules.md).

**Critical rules:** Revision immutability, lifecycle transitions, BOM validation, cycle prevention, change approval conditions.

---

## 4. Milestone Mapping

| Milestone | Requirements Covered |
|-----------|---------------------|
| M4 | Infrastructure setup (no functional requirements) |
| M5 | FR-AUTH-*, infrastructure |
| M6 | FR-PROD-*, FR-COMP-*, FR-AUD-* (partial) |
| M7 | FR-BOM-*, FR-AUD-* (partial) |
| M8 | FR-REQ-*, FR-AUD-* (partial) |
| M9 | FR-DEP-*, graph algorithms |
| M10 | FR-IMP-*, BOM comparison |
| M11 | FR-CHG-*, FR-WF-* |
| M12 | FR-SRCH-*, FR-DOC-*, hardening |

---

## Document Status

| Field | Value |
|-------|-------|
| Milestone | M1 — Requirements Engineering |
| Status | COMPLETE |
| Last Updated | 2026-09-10 |
