# OpenPLM — Engineering Terminology Glossary

## Purpose

Canonical definitions for engineering and PLM terms used throughout the OpenPLM project. All team members and AI assistants must use these terms consistently.

---

## Core Terms

### Product
A logical engineering entity representing a complete system or deliverable. A product has stable identity and one or more revisions. Example: *SAC-001 — Smart Access Control System*.

### Product Revision
One engineering version of a product. Each revision captures the product's state at a point in its lifecycle. Released revisions are immutable.

### Component
A logical engineering entity representing a part, sub-assembly, module, or firmware element within a product. Components have stable identity and one or more revisions. Example: *Camera Firmware*.

### Component Revision
One engineering version of a component. Example: *Camera Firmware Rev C*.

### Revision
A general term for a versioned snapshot of an engineering object (product, component, requirement, or document). Revisions use numeric ordering internally (1, 2, 3) with display codes (A, B, C).

### Bill of Materials (BOM)
A hierarchical list of components (and their revisions) that make up a specific product revision. BOMs are revision-aware — they reference specific component revisions, not just components.

### BOM Item
A single line item in a BOM, referencing a specific component revision with a quantity. BOM items can be nested (parent-child) to represent assembly hierarchies.

### Requirement
A formal engineering requirement with stable identity and versioned content. Requirements are linked to products, components, and other engineering objects for traceability. Example: *REQ-001: System shall support facial authentication*.

### Requirement Revision
One version of a requirement's content. Requirements evolve over time; each version is a requirement revision.

### Dependency
A directed relationship between two engineering objects. Dependencies form a graph that powers impact analysis. Example: *Camera Firmware DEPENDS_ON Camera Module*.

### Dependency Graph
The directed graph formed by all dependencies in the system. Nodes are engineering objects; edges are dependency relationships. This graph is central to impact analysis.

---

## Change Management Terms

### Change Request (CR)
A formal proposal to modify one or more engineering objects. Change requests follow a defined lifecycle (Draft → Submitted → Impact Analysis → Under Review → Approved/Rejected → Implemented → Verified → Released).

### Change Item
A specific engineering object targeted by a change request. A single CR may target multiple change items.

### Engineering Change
The broader concept of a controlled modification to an engineering product, encompassing the change request, review, approval, and implementation.

---

## Impact Analysis Terms

### Impact Analysis
The process of discovering which engineering objects are affected by a proposed change. OpenPLM's core differentiator.

### Impact Result
One entry in an impact analysis report, identifying an affected entity, the impact type, and the traversal depth.

### Impact Type
The classification of how an entity is affected:
- **DIRECT** — Immediately connected to the changed entity
- **INDIRECT** — Reached through transitive dependencies
- **TRACEABILITY** — Connected through requirement or document links

### Impact Depth
The number of edges traversed from the changed entity to the impacted entity. Depth 0 = the changed entity itself; depth 1 = direct neighbors; depth 2+ = indirect.

### Risk Level
An assessment of the severity of impact: LOW, MEDIUM, HIGH, CRITICAL. Risk is a separate concept from depth — a depth-1 impact can be CRITICAL, and a depth-3 impact can be LOW.

---

## Lifecycle Terms

### Lifecycle State
The current status of an engineering object in its lifecycle. States: DRAFT, PROTOTYPING, IN_REVIEW, APPROVED, RELEASED, DEPRECATED.

### Lifecycle Transition
A valid state change in the lifecycle. Not all transitions are legal — the transition matrix is enforced by domain logic.

### Released
A lifecycle state indicating the engineering object is formally approved for use. **Released revisions are immutable** — they cannot be modified; a new revision must be created instead.

### Immutability
The principle that released engineering objects cannot be altered through normal application operations. Modifications require creating a new revision.

---

## Workflow Terms

### Workflow Definition
A reusable template defining the states, transitions, and rules for a process (e.g., Engineering Change Workflow).

### Workflow Instance
One execution of a workflow definition for a specific engineering object (e.g., the workflow instance for CR-0012).

### Workflow State
A named stage within a workflow (e.g., Impact Analysis, Under Review, Approved).

### Workflow Transition
A valid movement from one workflow state to another, potentially with conditions or guards.

### Workflow Task
A concrete work item assigned to a user as part of a workflow instance (e.g., "Review CR-0012 impact analysis").

---

## Infrastructure Terms

### Audit Event
An immutable record of a significant state-changing action in the system. Audit events capture: actor, action, entity type, entity ID, previous state, new state, metadata, and timestamp.

### Modular Monolith
The architectural pattern chosen for OpenPLM v1 — a single deployable unit with clear internal module boundaries, avoiding unnecessary distributed-system complexity.

### BOM Comparison
The process of comparing two BOM versions and classifying each item as ADDED, REMOVED, MODIFIED, or UNCHANGED.

---

## Graph Algorithm Terms

### BFS (Breadth-First Search)
Graph traversal algorithm used to discover downstream/direct/indirect impact level by level.

### DFS (Depth-First Search)
Graph traversal algorithm used for dependency exploration and deep path discovery.

### Cycle Detection
Algorithm to identify prohibited circular dependencies in the dependency graph.

### Topological Sort
Algorithm to produce a valid ordering of nodes in a directed acyclic graph (DAG), used for dependency ordering.

---

## Document Status

| Field | Value |
|-------|-------|
| Milestone | M0 — Domain Discovery |
| Status | COMPLETE |
| Last Updated | 2026-09-10 |
