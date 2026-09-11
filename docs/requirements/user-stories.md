# OpenPLM — User Stories

## Purpose
User stories organized by actor, describing the interactions each user class has with OpenPLM.

---

## Administrator Stories

| ID | Story |
|----|-------|
| US-ADM-001 | As an Administrator, I want to create user accounts so that team members can access the system |
| US-ADM-002 | As an Administrator, I want to assign roles to users so that access is appropriately controlled |
| US-ADM-003 | As an Administrator, I want to deactivate user accounts so that former team members lose access |
| US-ADM-004 | As an Administrator, I want to view audit history so that I can investigate actions taken in the system |
| US-ADM-005 | As an Administrator, I want to manage system configuration so that the platform operates correctly |

---

## Engineer Stories

### Product & Component Management
| ID | Story |
|----|-------|
| US-ENG-001 | As an Engineer, I want to create a product with a unique number so that I can begin managing its lifecycle |
| US-ENG-002 | As an Engineer, I want to create product revisions so that I can version my product's evolution |
| US-ENG-003 | As an Engineer, I want to create components with unique numbers so that I can define parts of my product |
| US-ENG-004 | As an Engineer, I want to create component revisions so that I can version component changes |
| US-ENG-005 | As an Engineer, I want to transition a revision through its lifecycle (DRAFT → PROTOTYPING → IN_REVIEW → APPROVED → RELEASED) so that it follows the engineering process |
| US-ENG-006 | As an Engineer, I want the system to prevent modification of released revisions so that released baselines are protected |

### BOM Management
| ID | Story |
|----|-------|
| US-ENG-007 | As an Engineer, I want to build a BOM for a product revision so that I can define its structure |
| US-ENG-008 | As an Engineer, I want to add BOM items referencing specific component revisions so that the BOM is revision-aware |
| US-ENG-009 | As an Engineer, I want to nest BOM items so that I can represent assembly hierarchies |
| US-ENG-010 | As an Engineer, I want to view the BOM as a tree so that I can understand the product structure |
| US-ENG-011 | As an Engineer, I want to compare two BOM versions so that I can see what changed |

### Requirements
| ID | Story |
|----|-------|
| US-ENG-012 | As an Engineer, I want to create requirements so that I can define what the product must do |
| US-ENG-013 | As an Engineer, I want to link requirements to products and components so that I can trace engineering decisions |
| US-ENG-014 | As an Engineer, I want to view traceability between requirements and engineering objects so that I can verify coverage |

### Dependencies
| ID | Story |
|----|-------|
| US-ENG-015 | As an Engineer, I want to define dependencies between engineering objects so that relationships are documented |
| US-ENG-016 | As an Engineer, I want the system to prevent cyclic dependencies so that the dependency graph remains valid |
| US-ENG-017 | As an Engineer, I want to view the dependency graph so that I can understand object relationships |

### Changes & Impact
| ID | Story |
|----|-------|
| US-ENG-018 | As an Engineer, I want to create a change request targeting specific engineering objects so that I can propose modifications |
| US-ENG-019 | As an Engineer, I want to run impact analysis on a change request so that I can see what will be affected |
| US-ENG-020 | As an Engineer, I want to see direct, indirect, and traceability impacts so that I understand the full scope of a change |
| US-ENG-021 | As an Engineer, I want to submit a change request for review so that it enters the approval workflow |
| US-ENG-022 | As an Engineer, I want to implement an approved change by creating new revisions so that the modification is properly tracked |

### Search
| ID | Story |
|----|-------|
| US-ENG-023 | As an Engineer, I want to search for products, components, requirements, and changes so that I can find what I need |

---

## Reviewer Stories

| ID | Story |
|----|-------|
| US-REV-001 | As a Reviewer, I want to see my assigned review tasks so that I know what requires my attention |
| US-REV-002 | As a Reviewer, I want to view the impact analysis for a change request so that I can understand its effects |
| US-REV-003 | As a Reviewer, I want to approve a change request so that implementation can proceed |
| US-REV-004 | As a Reviewer, I want to reject a change request with a reason so that the engineer can address concerns |
| US-REV-005 | As a Reviewer, I want to view the BOM comparison for a change so that I can see structural differences |

---

## Viewer Stories

| ID | Story |
|----|-------|
| US-VWR-001 | As a Viewer, I want to view products and their revisions so that I can access engineering information |
| US-VWR-002 | As a Viewer, I want to view BOMs so that I can understand product structure |
| US-VWR-003 | As a Viewer, I want to view requirements so that I can understand product requirements |
| US-VWR-004 | As a Viewer, I want to view change requests and their impact analyses so that I can stay informed |

---

## Document Status

| Field | Value |
|-------|-------|
| Milestone | M1 — Requirements Engineering |
| Status | COMPLETE |
| Last Updated | 2026-09-10 |
