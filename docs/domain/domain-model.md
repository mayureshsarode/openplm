# OpenPLM — Domain Model

## Purpose
Defines all domain entities, their attributes, relationships, aggregates, and lifecycle rules for the OpenPLM system.

---

## 1. Entity Overview

```
┌─────────────────────────────────────────────────────────┐
│                    IDENTITY                              │
│  User  ·  Role  ·  UserRole                             │
├─────────────────────────────────────────────────────────┤
│                    PRODUCT                               │
│  Product  ·  ProductRevision                            │
├─────────────────────────────────────────────────────────┤
│                    COMPONENT                             │
│  Component  ·  ComponentRevision                        │
├─────────────────────────────────────────────────────────┤
│                    BOM                                   │
│  BOM  ·  BOMItem                                        │
├─────────────────────────────────────────────────────────┤
│                    REQUIREMENTS                          │
│  Requirement  ·  RequirementRevision                    │
├─────────────────────────────────────────────────────────┤
│                    DEPENDENCIES                          │
│  Dependency                                             │
├─────────────────────────────────────────────────────────┤
│                    CHANGES                               │
│  ChangeRequest  ·  ChangeItem                           │
│  ImpactAnalysis  ·  ImpactResult                        │
├─────────────────────────────────────────────────────────┤
│                    WORKFLOW                               │
│  WorkflowDefinition  ·  WorkflowState                   │
│  WorkflowTransition  ·  WorkflowInstance                │
│  WorkflowTask                                           │
├─────────────────────────────────────────────────────────┤
│                    DOCUMENTS                             │
│  Document  ·  DocumentRevision                          │
├─────────────────────────────────────────────────────────┤
│                    AUDIT                                 │
│  AuditEvent                                             │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Identity Domain

### User
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| email | string | unique, not null |
| passwordHash | string | not null |
| firstName | string | not null |
| lastName | string | not null |
| isActive | boolean | default true |
| createdAt | timestamp | not null |
| updatedAt | timestamp | not null |

### Role
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| name | string | unique, not null (ADMIN, ENGINEER, REVIEWER, VIEWER) |
| description | string | |
| permissions | string[] | list of permission codes |

### UserRole
| Attribute | Type | Constraints |
|-----------|------|-------------|
| userId | UUID | FK → User |
| roleId | UUID | FK → Role |
| assignedAt | timestamp | not null |

Composite PK: (userId, roleId)

---

## 3. Product Domain

### Product
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| productNumber | string | unique, not null (e.g., "SAC-001") |
| name | string | not null |
| description | string | |
| createdBy | UUID | FK → User |
| createdAt | timestamp | not null |
| updatedAt | timestamp | not null |

### ProductRevision
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| productId | UUID | FK → Product |
| revisionNumber | integer | not null (1, 2, 3...) |
| displayCode | string | not null ("A", "B", "C"...) |
| status | enum | DRAFT, PROTOTYPING, IN_REVIEW, APPROVED, RELEASED, DEPRECATED |
| description | string | |
| createdBy | UUID | FK → User |
| createdAt | timestamp | not null |
| updatedAt | timestamp | not null |

Unique constraint: (productId, revisionNumber)

**Relationship:** Product 1 → N ProductRevision

---

## 4. Component Domain

### Component
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| componentNumber | string | unique, not null (e.g., "CFW-001") |
| name | string | not null |
| type | string | (e.g., "HARDWARE", "SOFTWARE", "FIRMWARE", "MECHANICAL", "ELECTRICAL") |
| description | string | |
| createdBy | UUID | FK → User |
| createdAt | timestamp | not null |
| updatedAt | timestamp | not null |

### ComponentRevision
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| componentId | UUID | FK → Component |
| revisionNumber | integer | not null |
| displayCode | string | not null |
| status | enum | DRAFT, PROTOTYPING, IN_REVIEW, APPROVED, RELEASED, DEPRECATED |
| description | string | |
| createdBy | UUID | FK → User |
| createdAt | timestamp | not null |
| updatedAt | timestamp | not null |

Unique constraint: (componentId, revisionNumber)

**Relationship:** Component 1 → N ComponentRevision

---

## 5. BOM Domain

### BOM
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| productRevisionId | UUID | FK → ProductRevision, unique |
| createdBy | UUID | FK → User |
| createdAt | timestamp | not null |
| updatedAt | timestamp | not null |

**Relationship:** ProductRevision 1 → 1 BOM

### BOMItem
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| bomId | UUID | FK → BOM |
| componentRevisionId | UUID | FK → ComponentRevision |
| parentBomItemId | UUID | FK → BOMItem (nullable, for nesting) |
| quantity | integer | > 0 |
| position | integer | ordering within parent |
| createdAt | timestamp | not null |
| updatedAt | timestamp | not null |

**Relationships:**
- BOM 1 → N BOMItem
- BOMItem → ComponentRevision
- BOMItem → optional parent BOMItem (self-referential for hierarchy)

---

## 6. Requirements Domain

### Requirement
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| requirementNumber | string | unique, not null (e.g., "REQ-001") |
| title | string | not null |
| priority | enum | LOW, MEDIUM, HIGH, CRITICAL |
| createdBy | UUID | FK → User |
| createdAt | timestamp | not null |
| updatedAt | timestamp | not null |

### RequirementRevision
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| requirementId | UUID | FK → Requirement |
| revisionNumber | integer | not null |
| displayCode | string | not null |
| content | text | not null |
| status | enum | DRAFT, IN_REVIEW, APPROVED, RELEASED, DEPRECATED |
| createdBy | UUID | FK → User |
| createdAt | timestamp | not null |
| updatedAt | timestamp | not null |

Unique constraint: (requirementId, revisionNumber)

### Traceability Links (Association Tables)

**RequirementProductLink**
| Attribute | Type | Constraints |
|-----------|------|-------------|
| requirementRevisionId | UUID | FK → RequirementRevision |
| productRevisionId | UUID | FK → ProductRevision |
| createdAt | timestamp | not null |

Composite PK: (requirementRevisionId, productRevisionId)

**RequirementComponentLink**
| Attribute | Type | Constraints |
|-----------|------|-------------|
| requirementRevisionId | UUID | FK → RequirementRevision |
| componentRevisionId | UUID | FK → ComponentRevision |
| createdAt | timestamp | not null |

Composite PK: (requirementRevisionId, componentRevisionId)

---

## 7. Dependency Domain

### Dependency
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| sourceType | string | not null (e.g., "PRODUCT_REVISION", "COMPONENT_REVISION") |
| sourceId | UUID | not null |
| targetType | string | not null |
| targetId | UUID | not null |
| relationshipType | enum | DEPENDS_ON, PART_OF, IMPLEMENTS, TESTS, DOCUMENTS |
| metadata | JSON | optional |
| createdBy | UUID | FK → User |
| createdAt | timestamp | not null |

Unique constraint: (sourceType, sourceId, targetType, targetId, relationshipType)

> **Note:** Because source and target are polymorphic (can reference different entity types), standard FK constraints cannot be used. The application/domain layer validates entity existence.

---

## 8. Change Domain

### ChangeRequest
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| changeNumber | string | unique, not null (e.g., "CR-0012") |
| title | string | not null |
| description | text | |
| reason | text | |
| priority | enum | LOW, MEDIUM, HIGH, CRITICAL |
| status | enum | DRAFT, SUBMITTED, IMPACT_ANALYSIS, UNDER_REVIEW, APPROVED, REJECTED, IMPLEMENTED, VERIFIED, RELEASED |
| requestedBy | UUID | FK → User |
| createdAt | timestamp | not null |
| updatedAt | timestamp | not null |

### ChangeItem
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| changeRequestId | UUID | FK → ChangeRequest |
| entityType | string | not null |
| entityId | UUID | not null |
| fromRevisionId | UUID | nullable |
| toRevisionId | UUID | nullable |
| description | string | |
| createdAt | timestamp | not null |

### ImpactAnalysis
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| changeRequestId | UUID | FK → ChangeRequest |
| version | integer | not null |
| status | enum | PENDING, RUNNING, COMPLETED, FAILED |
| algorithmVersion | string | not null (e.g., "impact-engine-v1") |
| startedAt | timestamp | |
| completedAt | timestamp | |
| createdAt | timestamp | not null |

### ImpactResult
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| impactAnalysisId | UUID | FK → ImpactAnalysis |
| entityType | string | not null |
| entityId | UUID | not null |
| entityName | string | for display |
| impactType | enum | DIRECT, INDIRECT, TRACEABILITY |
| depth | integer | >= 0 |
| riskLevel | enum | LOW, MEDIUM, HIGH, CRITICAL |
| details | JSON | optional |
| createdAt | timestamp | not null |

---

## 9. Workflow Domain

### WorkflowDefinition
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| name | string | unique, not null |
| description | string | |
| isActive | boolean | default true |
| createdAt | timestamp | not null |

### WorkflowState
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| workflowDefinitionId | UUID | FK → WorkflowDefinition |
| name | string | not null |
| stateType | enum | INITIAL, INTERMEDIATE, TERMINAL |
| createdAt | timestamp | not null |

### WorkflowTransition
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| workflowDefinitionId | UUID | FK → WorkflowDefinition |
| fromStateId | UUID | FK → WorkflowState |
| toStateId | UUID | FK → WorkflowState |
| name | string | |
| requiredPermission | string | nullable |
| createdAt | timestamp | not null |

### WorkflowInstance
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| workflowDefinitionId | UUID | FK → WorkflowDefinition |
| currentStateId | UUID | FK → WorkflowState |
| entityType | string | not null |
| entityId | UUID | not null |
| startedAt | timestamp | not null |
| completedAt | timestamp | nullable |

### WorkflowTask
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| workflowInstanceId | UUID | FK → WorkflowInstance |
| assignedTo | UUID | FK → User |
| taskType | string | not null |
| status | enum | PENDING, IN_PROGRESS, COMPLETED, CANCELLED |
| description | string | |
| dueDate | timestamp | nullable |
| completedAt | timestamp | nullable |
| createdAt | timestamp | not null |

---

## 10. Document Domain

### Document
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| documentNumber | string | unique, not null |
| title | string | not null |
| type | string | |
| createdBy | UUID | FK → User |
| createdAt | timestamp | not null |
| updatedAt | timestamp | not null |

### DocumentRevision
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| documentId | UUID | FK → Document |
| revisionNumber | integer | not null |
| displayCode | string | not null |
| status | enum | DRAFT, IN_REVIEW, APPROVED, RELEASED, DEPRECATED |
| content | text | |
| createdBy | UUID | FK → User |
| createdAt | timestamp | not null |
| updatedAt | timestamp | not null |

Unique constraint: (documentId, revisionNumber)

---

## 11. Audit Domain

### AuditEvent
| Attribute | Type | Constraints |
|-----------|------|-------------|
| id | UUID | PK |
| actorId | UUID | FK → User |
| action | string | not null (e.g., PRODUCT_CREATED, REVISION_RELEASED) |
| entityType | string | not null |
| entityId | UUID | not null |
| previousState | JSON | nullable |
| newState | JSON | nullable |
| metadata | JSON | nullable |
| createdAt | timestamp | not null |

**Audit events are append-only.** Normal users cannot edit or delete audit records.

---

## 12. Relationship Summary

```
Product 1 ──→ N ProductRevision
Component 1 ──→ N ComponentRevision
Requirement 1 ──→ N RequirementRevision
Document 1 ──→ N DocumentRevision

ProductRevision 1 ──→ 1 BOM
BOM 1 ──→ N BOMItem
BOMItem ──→ ComponentRevision
BOMItem ──→ optional parent BOMItem

RequirementRevision ←──→ ProductRevision   (via RequirementProductLink)
RequirementRevision ←──→ ComponentRevision (via RequirementComponentLink)

Dependency: Source ──→ Target (polymorphic)

ChangeRequest 1 ──→ N ChangeItem
ChangeRequest 1 ──→ N ImpactAnalysis
ImpactAnalysis 1 ──→ N ImpactResult
ChangeRequest ──→ WorkflowInstance

WorkflowDefinition 1 ──→ N WorkflowState
WorkflowDefinition 1 ──→ N WorkflowTransition
WorkflowInstance ──→ WorkflowDefinition
WorkflowInstance ──→ current WorkflowState
WorkflowInstance 1 ──→ N WorkflowTask

AuditEvent ──→ actor (User)
AuditEvent ──→ entity (polymorphic via entityType + entityId)
```

---

## 13. Lifecycle Model

### Product / Component Revision Lifecycle
```
DRAFT → PROTOTYPING → IN_REVIEW → APPROVED → RELEASED → DEPRECATED
```

### Change Request Lifecycle
```
DRAFT → SUBMITTED → IMPACT_ANALYSIS → UNDER_REVIEW → APPROVED → IMPLEMENTED → VERIFIED → RELEASED
                                                    ↘ REJECTED
```

### Revision Immutability Rule
> A revision in RELEASED state is **immutable**. To modify a released object, a new revision must be created.

---

## Document Status

| Field | Value |
|-------|-------|
| Milestone | M2 — Domain & System Design |
| Status | COMPLETE |
| Last Updated | 2026-09-10 |
