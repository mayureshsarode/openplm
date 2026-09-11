# OpenPLM — Use Cases

## Purpose
Core use cases with preconditions, main flows, alternative flows, and postconditions.

---

## UC-001: Create Product

| Field | Value |
|-------|-------|
| **Actor** | Engineer |
| **Preconditions** | User is authenticated with PRODUCT_CREATE permission |
| **Trigger** | Engineer initiates product creation |

**Main Flow:**
1. Engineer provides product number, name, and description
2. System validates input (required fields, format)
3. System verifies product number is unique
4. System creates product record
5. System creates initial product revision (Rev A, DRAFT)
6. System records PRODUCT_CREATED audit event
7. System returns created product with revision

**Alternative Flows:**
- 3a. Product number already exists → return error DUPLICATE_PRODUCT_NUMBER
- 2a. Validation fails → return error with details

**Postconditions:**
- Product exists with unique number
- Initial revision exists in DRAFT state
- Audit event recorded

---

## UC-002: Create Component

| Field | Value |
|-------|-------|
| **Actor** | Engineer |
| **Preconditions** | User is authenticated with COMPONENT_CREATE permission |

**Main Flow:**
1. Engineer provides component number, name, type, and description
2. System validates input
3. System verifies component number is unique
4. System creates component record
5. System creates initial component revision (Rev A, DRAFT)
6. System records audit event
7. System returns created component with revision

**Alternative Flows:**
- 3a. Component number already exists → error

---

## UC-003: Create Revision

| Field | Value |
|-------|-------|
| **Actor** | Engineer |
| **Preconditions** | Parent entity exists; user has appropriate permission |

**Main Flow:**
1. Engineer requests new revision for a product or component
2. System determines next revision number (previous + 1)
3. System creates revision with DRAFT status
4. System records REVISION_CREATED audit event
5. System returns new revision

**Alternative Flows:**
- 2a. Previous revision is still in DRAFT → error (only one active draft at a time, if enforced)

---

## UC-004: Transition Lifecycle State

| Field | Value |
|-------|-------|
| **Actor** | Engineer / Reviewer |
| **Preconditions** | Revision exists; user has permission; transition is valid |

**Main Flow:**
1. User requests state transition (e.g., DRAFT → PROTOTYPING)
2. System validates transition against lifecycle state machine
3. System updates revision status
4. System records audit event with previous and new state
5. System returns updated revision

**Alternative Flows:**
- 2a. Invalid transition (e.g., DRAFT → RELEASED) → error INVALID_STATE_TRANSITION

---

## UC-005: Build BOM

| Field | Value |
|-------|-------|
| **Actor** | Engineer |
| **Preconditions** | Product revision exists in editable state (not RELEASED); user has BOM_EDIT permission |

**Main Flow:**
1. Engineer creates BOM for product revision (if not exists)
2. Engineer adds BOM items, each referencing a specific component revision with quantity
3. System validates: quantity > 0, component revision exists, no circular structure
4. System creates/updates BOM items
5. System records BOM_MODIFIED audit event

**Alternative Flows:**
- 2a. Product revision is RELEASED → error IMMUTABLE_REVISION
- 3a. Quantity ≤ 0 → error INVALID_QUANTITY
- 3b. Component revision not found → error ENTITY_NOT_FOUND

---

## UC-006: Create Requirement & Link

| Field | Value |
|-------|-------|
| **Actor** | Engineer |
| **Preconditions** | User has REQUIREMENT_CREATE permission |

**Main Flow:**
1. Engineer provides requirement number, title, description, priority
2. System validates uniqueness and input
3. System creates requirement and initial revision
4. Engineer links requirement revision to product/component revisions
5. System validates target entities exist
6. System creates traceability links
7. System records audit event

---

## UC-007: Define Dependency

| Field | Value |
|-------|-------|
| **Actor** | Engineer |
| **Preconditions** | User has DEPENDENCY_CREATE permission |

**Main Flow:**
1. Engineer specifies source (type + ID), target (type + ID), and relationship type
2. System validates source and target entities exist
3. System validates no self-dependency
4. System validates no duplicate (source + target + type)
5. System checks for prohibited cycles (cycle detection)
6. System creates dependency
7. System records DEPENDENCY_CREATED audit event

**Alternative Flows:**
- 2a. Entity not found → error
- 3a. Self-dependency → error SELF_DEPENDENCY
- 4a. Duplicate → error DUPLICATE_DEPENDENCY
- 5a. Cycle detected → error CYCLE_DETECTED

---

## UC-008: Create Change Request

| Field | Value |
|-------|-------|
| **Actor** | Engineer |
| **Preconditions** | User has CHANGE_CREATE permission |

**Main Flow:**
1. Engineer provides change title, description, reason, priority
2. System generates unique change number
3. System creates change request in DRAFT status
4. Engineer adds change items (target entities)
5. System validates target entities exist
6. System records CHANGE_CREATED audit event

---

## UC-009: Run Impact Analysis

| Field | Value |
|-------|-------|
| **Actor** | Engineer |
| **Preconditions** | Change request exists; user has IMPACT_RUN permission |

**Main Flow:**
1. Engineer triggers impact analysis for a change request
2. System loads changed entities from change items
3. System loads relevant relationships/dependencies
4. System builds dependency graph
5. System validates graph (cycle detection)
6. System traverses graph (BFS) from changed entities
7. System collects impacted nodes with classification:
   - DIRECT (depth 1)
   - INDIRECT (depth 2+)
   - TRACEABILITY (requirement/document links)
8. System applies impact rules (risk assessment)
9. System persists impact analysis with version and results
10. System records IMPACT_ANALYSIS_RUN audit event
11. System returns impact report

**Alternative Flows:**
- 6a. Cycle detected in graph → include warning in results
- 7a. No dependencies found → return empty impact (only changed entities)

---

## UC-010: Submit Change for Review

| Field | Value |
|-------|-------|
| **Actor** | Engineer |
| **Preconditions** | Change is in DRAFT or has completed impact analysis |

**Main Flow:**
1. Engineer submits change request
2. System transitions change to SUBMITTED
3. System creates workflow instance
4. System assigns review tasks to appropriate reviewers
5. System records CHANGE_SUBMITTED audit event

---

## UC-011: Approve / Reject Change

| Field | Value |
|-------|-------|
| **Actor** | Reviewer |
| **Preconditions** | Change is UNDER_REVIEW; user has CHANGE_APPROVE or CHANGE_REJECT permission; impact analysis is complete |

**Main Flow (Approve):**
1. Reviewer reviews impact analysis
2. Reviewer approves change
3. System validates impact analysis has been completed
4. System transitions change to APPROVED
5. System completes review task
6. System records CHANGE_APPROVED audit event

**Main Flow (Reject):**
1. Reviewer reviews impact analysis
2. Reviewer rejects change with reason
3. System transitions change to REJECTED
4. System completes review task
5. System records CHANGE_REJECTED audit event

**Alternative Flows:**
- 3a. No impact analysis completed → error IMPACT_ANALYSIS_REQUIRED

---

## UC-012: Implement & Release Change

| Field | Value |
|-------|-------|
| **Actor** | Engineer |
| **Preconditions** | Change is APPROVED |

**Main Flow:**
1. Engineer creates new revisions for affected objects
2. Engineer implements modifications in new revisions
3. System transitions change to IMPLEMENTED
4. Engineer verifies changes
5. System transitions change to VERIFIED
6. Engineer releases new revisions
7. System transitions change to RELEASED
8. System records all relevant audit events

---

## UC-013: View Audit History

| Field | Value |
|-------|-------|
| **Actor** | Administrator, Engineer, Reviewer |
| **Preconditions** | User has AUDIT_VIEW permission |

**Main Flow:**
1. User requests audit history for an entity (or system-wide)
2. System retrieves audit events ordered by timestamp
3. System returns paginated audit history

---

## Document Status

| Field | Value |
|-------|-------|
| Milestone | M1 — Requirements Engineering |
| Status | COMPLETE |
| Last Updated | 2026-09-10 |
