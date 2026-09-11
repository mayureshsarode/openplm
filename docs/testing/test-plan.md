# OpenPLM — Test Plan

## Purpose
Concrete test cases organized by domain area, including edge cases and failure scenarios.

---

## 1. Authentication Tests

| Test | Expected |
|------|----------|
| Register with valid data | 201, user created |
| Register with duplicate email | 409, DUPLICATE_ENTITY |
| Login with valid credentials | 200, tokens returned |
| Login with wrong password | 401, UNAUTHORIZED |
| Access protected endpoint without token | 401 |
| Access protected endpoint with expired token | 401 |
| Refresh with valid refresh token | 200, new tokens |
| RBAC: Engineer creates product | 201 |
| RBAC: Viewer creates product | 403, FORBIDDEN |
| RBAC: Reviewer approves change | 200 |
| RBAC: Engineer approves change | 403, FORBIDDEN |

---

## 2. Product & Component Tests

| Test | Expected |
|------|----------|
| Create product with valid data | 201, product + initial revision |
| Create product with duplicate number | 409 |
| Create product revision | 201, next revision number |
| Transition DRAFT → PROTOTYPING | 200 |
| Transition DRAFT → RELEASED (invalid) | 400, INVALID_STATE_TRANSITION |
| Modify released revision | 400, IMMUTABLE_REVISION |
| List products with pagination | 200, paginated response |
| Get product details | 200, product + revisions |

---

## 3. BOM Tests

| Test | Expected |
|------|----------|
| Create BOM for draft product revision | 201 |
| Add BOM item with valid component revision | 201 |
| Add BOM item with quantity 0 | 400, INVALID_QUANTITY |
| Add BOM item with negative quantity | 400, INVALID_QUANTITY |
| Add BOM item with non-existent component | 404 |
| Add nested BOM item (parent-child) | 201 |
| Modify BOM on released revision | 400, IMMUTABLE_REVISION |
| Get BOM tree | 200, hierarchical structure |
| Compare two BOMs | 200, added/removed/modified/unchanged |

---

## 4. Requirement & Traceability Tests

| Test | Expected |
|------|----------|
| Create requirement | 201 |
| Create requirement with duplicate number | 409 |
| Link requirement to product revision | 201 |
| Link requirement to component revision | 201 |
| Get traceability for requirement | 200, linked entities |
| Get traceability for product | 200, linked requirements |

---

## 5. Dependency Tests

| Test | Expected |
|------|----------|
| Create valid dependency | 201 |
| Create self-dependency | 400, SELF_DEPENDENCY |
| Create duplicate dependency | 400, DUPLICATE_DEPENDENCY |
| Create dependency with missing source | 400 |
| Create dependency with missing target | 400 |
| Create dependency causing cycle | 400, CYCLE_DETECTED |

---

## 6. Graph Algorithm Tests

| Test | Expected |
|------|----------|
| BFS on empty graph | Empty result |
| BFS on single node | Only start node |
| BFS on linear chain (A→B→C) | Correct depth ordering |
| BFS on tree | Level-order traversal |
| BFS with max depth limit | Stops at depth |
| DFS on empty graph | Empty result |
| DFS on linear chain | Correct DFS ordering |
| Cycle detection: no cycle | false |
| Cycle detection: simple cycle (A→B→A) | true, cycle path |
| Cycle detection: complex cycle | true, cycle path |
| Topological sort: valid DAG | Correct ordering |
| Topological sort: graph with cycle | Error |
| Topological sort: disconnected DAG | Valid ordering |

---

## 7. Impact Analysis Tests

| Test | Expected |
|------|----------|
| Impact on entity with no dependencies | Only changed entity |
| Impact with single dependency | One DIRECT result |
| Impact with chain A→B→C | B=DIRECT, C=INDIRECT |
| Impact with multiple paths to same node | No duplicate, shortest depth |
| Impact with traceability links | TRACEABILITY results included |
| Impact with cycle in graph | Handled, no infinite loop |
| Impact persisted correctly | DB contains analysis + results |
| Impact re-analysis creates new version | version incremented |

---

## 8. Change Management Tests

| Test | Expected |
|------|----------|
| Create change request | 201 |
| Add change items | 201 |
| Submit change | Status → SUBMITTED |
| Approve without impact analysis | 400, IMPACT_ANALYSIS_REQUIRED |
| Approve with impact analysis | Status → APPROVED |
| Reject with reason | Status → REJECTED |
| Unauthorized approval | 403 |
| Invalid status transition | 400 |
| Complete workflow: submit → analyze → review → approve → implement → verify → release | All transitions succeed |

---

## 9. Audit Tests

| Test | Expected |
|------|----------|
| Product creation generates audit event | PRODUCT_CREATED event exists |
| Revision release generates audit event | REVISION_RELEASED event exists |
| Audit events are append-only | DELETE/UPDATE rejected |
| Get audit history for entity | Paginated events returned |

---

## 10. Golden Scenario E2E

Full end-to-end test covering the complete scenario from [golden-scenario.md](../requirements/golden-scenario.md):

Login → Create Product → Create Components → Build BOM → Create Requirements → Define Dependencies → Create Change → Run Impact Analysis → Submit → Approve → Implement → Verify → Release → Inspect Audit

---

## Document Status

| Field | Value |
|-------|-------|
| Milestone | M3 — Physical Architecture & Database Design |
| Status | COMPLETE |
| Last Updated | 2026-09-10 |
