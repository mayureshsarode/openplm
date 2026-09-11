# OpenPLM — Business Rules

## Purpose
Engineering business rules that the domain layer must enforce. These rules are invariants — they cannot be bypassed for convenience.

---

## BR-REV: Revision Rules

| ID | Rule |
|----|------|
| BR-REV-001 | Every product and component must have at least one revision upon creation |
| BR-REV-002 | Revision numbers are numeric (1, 2, 3...) with display codes (A, B, C...) |
| BR-REV-003 | Revision numbers must be unique within their parent entity: (entity_id, revision_number) |
| BR-REV-004 | Numeric ordering is the authoritative revision ordering mechanism — not string comparison |
| BR-REV-005 | **Released revisions are immutable** — they cannot be modified through normal application operations |
| BR-REV-006 | Modification of a released revision requires creation of a new revision |
| BR-REV-007 | New revisions are always created in DRAFT state |

---

## BR-LC: Lifecycle Rules

| ID | Rule |
|----|------|
| BR-LC-001 | Products and components use the lifecycle: DRAFT → PROTOTYPING → IN_REVIEW → APPROVED → RELEASED → DEPRECATED |
| BR-LC-002 | The legal transition matrix must be centralized in domain logic |
| BR-LC-003 | Invalid transitions must be rejected (e.g., DRAFT → RELEASED is not permitted) |
| BR-LC-004 | The transition matrix defines which state changes are valid |

### Lifecycle Transition Matrix

| From \ To | DRAFT | PROTOTYPING | IN_REVIEW | APPROVED | RELEASED | DEPRECATED |
|-----------|-------|-------------|-----------|----------|----------|------------|
| DRAFT | — | ✓ | | | | |
| PROTOTYPING | ✓ | — | ✓ | | | |
| IN_REVIEW | ✓ | | — | ✓ | | |
| APPROVED | | | ✓ | — | ✓ | |
| RELEASED | | | | | — | ✓ |
| DEPRECATED | | | | | | — |

> Note: Backward transitions (e.g., PROTOTYPING → DRAFT, IN_REVIEW → DRAFT) are permitted to support rework flows. APPROVED → IN_REVIEW is permitted to support re-review.

---

## BR-BOM: BOM Rules

| ID | Rule |
|----|------|
| BR-BOM-001 | A product revision has at most one BOM |
| BR-BOM-002 | BOM item quantity must be greater than zero |
| BR-BOM-003 | BOM items must reference a specific, existing component revision |
| BR-BOM-004 | Nested BOM relationships must be structurally valid (no circular nesting) |
| BR-BOM-005 | BOMs belonging to released product revisions cannot be modified |
| BR-BOM-006 | BOM comparison classifies items as: ADDED, REMOVED, MODIFIED, UNCHANGED |

---

## BR-DEP: Dependency Rules

| ID | Rule |
|----|------|
| BR-DEP-001 | A dependency defines a directed relationship: source → target |
| BR-DEP-002 | Self-dependencies are prohibited (source ≠ target when same type) |
| BR-DEP-003 | Duplicate dependencies are prohibited (unique: source + target + relationship type) |
| BR-DEP-004 | The application must validate that both source and target entities exist (since polymorphic references cannot use FK constraints) |
| BR-DEP-005 | Prohibited cyclic dependencies must be detected and rejected |
| BR-DEP-006 | The graph engine must not depend on Prisma or Express |

---

## BR-CHG: Change Management Rules

| ID | Rule |
|----|------|
| BR-CHG-001 | Change requests follow the lifecycle: DRAFT → SUBMITTED → IMPACT_ANALYSIS → UNDER_REVIEW → APPROVED/REJECTED → IMPLEMENTED → VERIFIED → RELEASED |
| BR-CHG-002 | Invalid change lifecycle transitions must be rejected |
| BR-CHG-003 | A change cannot be approved unless impact analysis has been completed |
| BR-CHG-004 | Approved changes must result in new revisions — released revisions cannot be modified directly |
| BR-CHG-005 | Change numbers must be unique |

---

## BR-IMP: Impact Analysis Rules

| ID | Rule |
|----|------|
| BR-IMP-001 | Impact types are: DIRECT, INDIRECT, TRACEABILITY |
| BR-IMP-002 | Traversal depth and risk level are separate concepts — depth does NOT equal risk |
| BR-IMP-003 | Impact analysis results must be persisted as historical engineering artifacts |
| BR-IMP-004 | Persisted analyses include algorithm version for future evolution |

---

## BR-WF: Workflow Rules

| ID | Rule |
|----|------|
| BR-WF-001 | Workflow definitions are reusable templates; workflow instances are executions |
| BR-WF-002 | Workflow transitions must follow the defined transition rules |
| BR-WF-003 | Tasks are assigned to specific users |

---

## BR-AUD: Audit Rules

| ID | Rule |
|----|------|
| BR-AUD-001 | Audit events are append-only — they cannot be edited or deleted |
| BR-AUD-002 | Significant state-changing actions must generate audit events |
| BR-AUD-003 | Audit events must capture: actor, action, entity type, entity ID, previous state, new state, metadata, timestamp |

---

## BR-SEC: Security Rules

| ID | Rule |
|----|------|
| BR-SEC-001 | Passwords must never be stored in plaintext |
| BR-SEC-002 | Authorization must be enforced server-side — never trust client-side only |
| BR-SEC-003 | Permission checks must be centralized, not scattered across controllers |
| BR-SEC-004 | Domain rules cannot be bypassed because an endpoint is internal |
| BR-SEC-005 | Secrets must not be exposed in source control |

---

## Document Status

| Field | Value |
|-------|-------|
| Milestone | M1 — Requirements Engineering |
| Status | COMPLETE |
| Last Updated | 2026-09-10 |
