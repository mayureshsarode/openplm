# OpenPLM — Functional Requirements

## Purpose
Complete list of functional requirements for OpenPLM, organized by domain.

---

## FR-AUTH: Authentication & Authorization

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AUTH-001 | The system shall allow users to register with email and password | Must |
| FR-AUTH-002 | The system shall allow users to log in with email and password | Must |
| FR-AUTH-003 | The system shall issue JWT access tokens and refresh tokens on successful login | Must |
| FR-AUTH-004 | The system shall validate JWT tokens on every protected API request | Must |
| FR-AUTH-005 | The system shall support refresh token rotation | Must |
| FR-AUTH-006 | The system shall enforce role-based access control (RBAC) on all protected endpoints | Must |
| FR-AUTH-007 | The system shall support four roles: Administrator, Engineer, Reviewer, Viewer | Must |
| FR-AUTH-008 | The system shall allow Administrators to assign roles to users | Must |
| FR-AUTH-009 | The system shall allow Administrators to create, update, and deactivate users | Must |
| FR-AUTH-010 | The system shall reject requests where the user lacks the required permission | Must |

### Permissions Matrix

| Permission | Admin | Engineer | Reviewer | Viewer |
|-----------|-------|----------|----------|--------|
| PRODUCT_CREATE | ✓ | ✓ | | |
| PRODUCT_UPDATE | ✓ | ✓ | | |
| PRODUCT_VIEW | ✓ | ✓ | ✓ | ✓ |
| COMPONENT_CREATE | ✓ | ✓ | | |
| COMPONENT_UPDATE | ✓ | ✓ | | |
| COMPONENT_VIEW | ✓ | ✓ | ✓ | ✓ |
| BOM_EDIT | ✓ | ✓ | | |
| BOM_VIEW | ✓ | ✓ | ✓ | ✓ |
| REQUIREMENT_CREATE | ✓ | ✓ | | |
| REQUIREMENT_UPDATE | ✓ | ✓ | | |
| REQUIREMENT_VIEW | ✓ | ✓ | ✓ | ✓ |
| DEPENDENCY_CREATE | ✓ | ✓ | | |
| DEPENDENCY_VIEW | ✓ | ✓ | ✓ | ✓ |
| CHANGE_CREATE | ✓ | ✓ | | |
| CHANGE_APPROVE | ✓ | | ✓ | |
| CHANGE_REJECT | ✓ | | ✓ | |
| CHANGE_VIEW | ✓ | ✓ | ✓ | ✓ |
| IMPACT_RUN | ✓ | ✓ | | |
| IMPACT_VIEW | ✓ | ✓ | ✓ | ✓ |
| AUDIT_VIEW | ✓ | ✓ | ✓ | |
| USER_MANAGE | ✓ | | | |

---

## FR-PROD: Product Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-PROD-001 | The system shall allow Engineers to create products with a unique product number, name, and description | Must |
| FR-PROD-002 | The system shall enforce unique product numbers | Must |
| FR-PROD-003 | The system shall allow creation of product revisions | Must |
| FR-PROD-004 | Product revisions shall have a numeric revision number (1, 2, 3...) and a display code (A, B, C...) | Must |
| FR-PROD-005 | Revision numbers shall be unique within a product: (product_id, revision_number) | Must |
| FR-PROD-006 | Product revisions shall follow the lifecycle: DRAFT → PROTOTYPING → IN_REVIEW → APPROVED → RELEASED → DEPRECATED | Must |
| FR-PROD-007 | The system shall reject invalid lifecycle transitions | Must |
| FR-PROD-008 | Released product revisions shall be immutable | Must |
| FR-PROD-009 | The system shall allow listing and filtering products | Must |
| FR-PROD-010 | The system shall allow viewing product details including all revisions | Must |

---

## FR-COMP: Component Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-COMP-001 | The system shall allow Engineers to create components with a unique component number, name, and description | Must |
| FR-COMP-002 | The system shall enforce unique component numbers | Must |
| FR-COMP-003 | The system shall allow creation of component revisions | Must |
| FR-COMP-004 | Component revisions shall have numeric ordering with display codes | Must |
| FR-COMP-005 | Revision numbers shall be unique within a component: (component_id, revision_number) | Must |
| FR-COMP-006 | Component revisions shall follow the same lifecycle as product revisions | Must |
| FR-COMP-007 | The system shall reject invalid lifecycle transitions | Must |
| FR-COMP-008 | Released component revisions shall be immutable | Must |

---

## FR-BOM: BOM Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-BOM-001 | The system shall allow creation of a BOM for a product revision | Must |
| FR-BOM-002 | A product revision shall have at most one BOM | Must |
| FR-BOM-003 | BOM items shall reference a specific component revision | Must |
| FR-BOM-004 | BOM items shall have a quantity greater than zero | Must |
| FR-BOM-005 | BOM items shall support nested parent-child relationships | Must |
| FR-BOM-006 | The system shall validate BOM structure integrity | Must |
| FR-BOM-007 | The system shall prevent modification of BOMs belonging to released product revisions | Must |
| FR-BOM-008 | The system shall display BOM as a hierarchical tree | Should |
| FR-BOM-009 | The system shall support BOM comparison between two product revisions | Must |
| FR-BOM-010 | BOM comparison shall classify items as ADDED, REMOVED, MODIFIED, or UNCHANGED | Must |

---

## FR-REQ: Requirements Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-REQ-001 | The system shall allow creation of requirements with unique requirement numbers | Must |
| FR-REQ-002 | Requirements shall support revisions with versioned content | Must |
| FR-REQ-003 | The system shall allow linking requirement revisions to product revisions | Must |
| FR-REQ-004 | The system shall allow linking requirement revisions to component revisions | Must |
| FR-REQ-005 | The system shall display traceability between requirements and engineering objects | Must |
| FR-REQ-006 | Requirements shall follow a lifecycle (DRAFT → IN_REVIEW → APPROVED → RELEASED → DEPRECATED) | Must |

---

## FR-DEP: Dependency Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DEP-001 | The system shall allow defining directed dependencies between engineering objects | Must |
| FR-DEP-002 | Dependencies shall have source, target, and relationship type | Must |
| FR-DEP-003 | The system shall support relationship types: DEPENDS_ON, PART_OF, IMPLEMENTS, TESTS, DOCUMENTS | Must |
| FR-DEP-004 | The system shall prevent duplicate identical dependencies (source + target + type) | Must |
| FR-DEP-005 | The system shall validate that source and target entities exist | Must |
| FR-DEP-006 | The system shall detect and prevent prohibited cyclic dependencies | Must |
| FR-DEP-007 | The system shall support self-referencing prevention | Must |
| FR-DEP-008 | The dependency graph engine shall not depend on Prisma or Express | Must |

---

## FR-IMP: Impact Analysis

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-IMP-001 | The system shall allow running impact analysis for a change request | Must |
| FR-IMP-002 | Impact analysis shall traverse the dependency graph from changed entities | Must |
| FR-IMP-003 | Impact analysis shall classify affected entities as DIRECT, INDIRECT, or TRACEABILITY | Must |
| FR-IMP-004 | Impact analysis shall record traversal depth for each impacted entity | Must |
| FR-IMP-005 | Impact analysis shall assess risk level (LOW, MEDIUM, HIGH, CRITICAL) separately from depth | Must |
| FR-IMP-006 | Impact analysis results shall be persisted as historical engineering artifacts | Must |
| FR-IMP-007 | Persisted analyses shall include: analysis ID, change request, version, status, timestamp, algorithm version, results | Must |
| FR-IMP-008 | The system shall display an impact report showing direct impact, indirect impact, requirements, and risk | Must |
| FR-IMP-009 | The system shall support BOM comparison as input to impact analysis | Should |

---

## FR-CHG: Change Management

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-CHG-001 | The system shall allow creation of change requests with unique change numbers | Must |
| FR-CHG-002 | Change requests shall include: title, description, reason, priority, requester, status | Must |
| FR-CHG-003 | Change requests shall identify one or more target change items | Must |
| FR-CHG-004 | Change requests shall follow the lifecycle: DRAFT → SUBMITTED → IMPACT_ANALYSIS → UNDER_REVIEW → APPROVED/REJECTED → IMPLEMENTED → VERIFIED → RELEASED | Must |
| FR-CHG-005 | The system shall reject invalid change lifecycle transitions | Must |
| FR-CHG-006 | A change cannot be approved unless impact analysis has been completed | Must |
| FR-CHG-007 | Approved changes shall result in creation of new revisions where required | Must |
| FR-CHG-008 | Released revisions shall not be modified directly — a new revision must be created | Must |

---

## FR-WF: Workflow & Tasks

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-WF-001 | The system shall support reusable workflow definitions with states and transitions | Must |
| FR-WF-002 | The system shall create workflow instances for change requests | Must |
| FR-WF-003 | The system shall assign workflow tasks to users | Must |
| FR-WF-004 | Reviewers shall be able to approve or reject via workflow tasks | Must |
| FR-WF-005 | The system shall enforce valid workflow transitions | Must |
| FR-WF-006 | The system shall track task status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED) | Must |

---

## FR-SRCH: Search

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-SRCH-001 | The system shall support searching products by number, name, or description | Must |
| FR-SRCH-002 | The system shall support searching components by number, name, or description | Must |
| FR-SRCH-003 | The system shall support searching requirements by number or text | Must |
| FR-SRCH-004 | The system shall support searching change requests by number, title, or status | Must |
| FR-SRCH-005 | The system shall support global search across all entity types | Should |

---

## FR-AUD: Audit Trail

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AUD-001 | The system shall record audit events for significant state changes | Must |
| FR-AUD-002 | Audit events shall include: actor, action, entity type, entity ID, previous state, new state, metadata, timestamp | Must |
| FR-AUD-003 | Audit events shall be append-only — users cannot edit or delete audit history | Must |
| FR-AUD-004 | The system shall support viewing audit history for any entity | Must |
| FR-AUD-005 | Auditable actions shall include: PRODUCT_CREATED, REVISION_CREATED, BOM_MODIFIED, DEPENDENCY_CREATED, CHANGE_CREATED, IMPACT_ANALYSIS_RUN, CHANGE_SUBMITTED, CHANGE_APPROVED, CHANGE_REJECTED, CHANGE_IMPLEMENTED, REVISION_RELEASED | Must |

---

## FR-DOC: Documents (Supporting)

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-DOC-001 | The system shall support document metadata with unique document numbers | Should |
| FR-DOC-002 | Documents shall support revisions | Should |
| FR-DOC-003 | Documents shall be linkable to products, components, and changes | Should |

---

## Document Status

| Field | Value |
|-------|-------|
| Milestone | M1 — Requirements Engineering |
| Status | COMPLETE |
| Last Updated | 2026-09-10 |
