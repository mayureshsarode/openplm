# Teamcenter X — Domain Reference Observations

## Purpose

This document records observations from studying Siemens Teamcenter X as a domain reference for OpenPLM. Teamcenter is used solely for **domain discovery** — understanding PLM concepts, workflows, and terminology. OpenPLM is not intended to replace, clone, or compete with Teamcenter.

---

## Concepts Observed in Teamcenter X

The following PLM concepts were identified from Teamcenter X reference materials:

| # | Concept | Description |
|---|---------|-------------|
| 1 | **BOM Management** | Hierarchical product structures with parent-child relationships, quantities, and revision-aware line items |
| 2 | **Impact Analysis** | Automated discovery of downstream effects when an engineering object changes |
| 3 | **Workflow Management** | Configurable approval/review workflows with tasks assigned to users |
| 4 | **Change Management** | Formal engineering change requests with lifecycle states, review, approval, and implementation tracking |
| 5 | **BOM Comparison** | Side-by-side diff of two BOM revisions showing added, removed, modified, and unchanged items |
| 6 | **Requirements Management** | Structured requirements with traceability links to engineering objects |
| 7 | **Visualization** | 2D/3D product visualization and markup |
| 8 | **Search** | Full-text and structured search across engineering objects |
| 9 | **Tasks** | Work items assigned to users as part of workflows |
| 10 | **Document Management** | Versioned engineering documents linked to products and components |
| 11 | **Classification** | Taxonomy-based classification of parts and components |
| 12 | **Quality Management** | Non-conformance reports, corrective actions, quality workflows |
| 13 | **CAD Integrations** | Integration with NX, Solid Edge, and other CAD tools for metadata and geometry |

---

## Concepts Selected for OpenPLM

### Primary (Core MVP)

These concepts are selected for deep implementation in OpenPLM v1:

| Concept | Justification |
|---------|---------------|
| Product & Product Structure | Foundation of any PLM system — the thing being managed |
| Components & Revisions | Engineering objects with versioned identity |
| BOM Management | Hierarchical assembly structure is core to product definition |
| Requirements & Traceability | Link engineering decisions to requirements for accountability |
| Dependencies | Relationships between objects that enable impact analysis |
| Graph Algorithms | BFS, DFS, cycle detection, topological sort — power the analysis engine |
| BOM Comparison | Diff two BOM versions to understand what changed |
| Change Management | Formal process for proposing, reviewing, and approving changes |
| Impact Analysis | **Core differentiator** — understand what a change affects before approving it |
| Workflow & Tasks | Structured review/approval process |
| Audit Trail | Immutable record of significant state changes |
| Search | Find engineering objects across the system |

### Supporting / Later

These are acknowledged but deferred beyond v1:

- Documents (basic metadata support in M12)
- Richer visualization (3D/2D)
- Classification / taxonomy
- Quality management
- External integrations
- CAD metadata import

---

## Explicit Non-Goals

The following are **not** in scope for OpenPLM, to prevent scope creep:

| Non-Goal | Reason |
|----------|--------|
| CAD authoring | OpenPLM manages lifecycle, not geometry creation |
| NX clone | Out of scope — OpenPLM is not a CAD tool |
| Solid Edge clone | Out of scope — OpenPLM is not a CAD tool |
| Complete Teamcenter clone | Teamcenter is an enterprise suite; OpenPLM is focused |
| Enterprise PLM replacement | OpenPLM is a focused platform, not a full enterprise system |
| Full ECAD system | Electrical CAD is a separate domain |
| Full enterprise scheduling | Project scheduling is a separate concern |
| Full enterprise quality suite | Quality management is deferred |
| Enterprise chat/collaboration | Communication tools are out of scope |

---

## Key Insight

> **Depth is preferred over breadth.**

OpenPLM selects a focused subset of PLM concepts and implements them deeply, rather than implementing all concepts shallowly. The core differentiator — **change impact analysis over an engineering dependency graph** — requires deep implementation of the dependency model, graph engine, and traceability system.

---

## Document Status

| Field | Value |
|-------|-------|
| Milestone | M0 — Domain Discovery |
| Status | COMPLETE |
| Last Updated | 2026-09-10 |
