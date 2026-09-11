# OpenPLM — Impact Analysis Design

## Purpose
Defines the impact analysis pipeline, classification model, and persistence strategy.

---

## 1. Pipeline

```
Change Request
    │
    ▼
Extract Changed Entities (from ChangeItems)
    │
    ▼
Load Relevant Dependencies (from database)
    │
    ▼
Load Traceability Links (requirement links)
    │
    ▼
Build Graph (nodes + edges)
    │
    ▼
Validate Graph (cycle detection)
    │
    ▼
Traverse Graph (BFS from changed entities)
    │
    ▼
Collect Impacted Nodes
    ├── DIRECT (depth 1)
    ├── INDIRECT (depth 2+)
    └── TRACEABILITY (requirement/document links)
    │
    ▼
Apply Impact Rules (risk assessment)
    │
    ▼
Persist Impact Analysis + Results
    │
    ▼
Return Impact Report
```

---

## 2. Impact Classification

### Impact Types
| Type | Definition | Traversal Depth |
|------|-----------|-----------------|
| DIRECT | Immediately connected to the changed entity via a dependency | Depth 1 |
| INDIRECT | Reached through transitive dependencies | Depth 2+ |
| TRACEABILITY | Connected through requirement or document traceability links | Any depth |

### Risk Levels
| Level | Description |
|-------|-------------|
| LOW | Minor impact, unlikely to cause issues |
| MEDIUM | Moderate impact, testing recommended |
| HIGH | Significant impact, review and testing required |
| CRITICAL | System-wide impact, comprehensive review required |

> **Important:** Risk level is a separate concept from traversal depth. A depth-1 impact can be CRITICAL (e.g., changing a safety-critical component), and a depth-3 impact can be LOW.

---

## 3. Impact Rules

Impact rules classify and assess each impacted entity:

```typescript
interface ImpactRule {
  name: string;
  evaluate(node: GraphNode, depth: number, context: ImpactContext): RiskLevel;
}
```

Initial rules:
1. **Depth-based default:** Provide a baseline risk based on depth (configurable, not authoritative)
2. **Traceability escalation:** If impacted entity is linked to requirements, consider escalating risk
3. **Entity-type weighting:** Product-level impacts may have different risk profiles than component-level

---

## 4. Persistence Model

Impact analysis is a **historical engineering artifact**. It must be persisted for audit and future reference.

### Stored Data
```
ImpactAnalysis
├── id (UUID)
├── changeRequestId (FK)
├── version (integer, allows re-analysis)
├── status (PENDING, RUNNING, COMPLETED, FAILED)
├── algorithmVersion (e.g., "impact-engine-v1")
├── startedAt
├── completedAt
├── createdAt
│
└── ImpactResults[]
    ├── id (UUID)
    ├── entityType
    ├── entityId
    ├── entityName (for display)
    ├── impactType (DIRECT, INDIRECT, TRACEABILITY)
    ├── depth (integer)
    ├── riskLevel (LOW, MEDIUM, HIGH, CRITICAL)
    ├── details (JSON, optional)
    └── createdAt
```

### Example Persisted Analysis
```
Impact Analysis: IA-009
Change Request: CR-0012
Algorithm: impact-engine v1
Status: COMPLETED

Results:
┌───────────────────────────┬─────────────┬───────┬──────┐
│ Entity                    │ Impact Type │ Depth │ Risk │
├───────────────────────────┼─────────────┼───────┼──────┤
│ Camera Module (CAM-001)   │ DIRECT      │ 1     │ HIGH │
│ Main Controller (CTRL-001)│ INDIRECT    │ 2     │ MED  │
│ SAC-001                   │ INDIRECT    │ 3     │ MED  │
│ REQ-001                   │ TRACEABILITY│ -     │ HIGH │
│ REQ-002                   │ TRACEABILITY│ -     │ HIGH │
│ REQ-003                   │ TRACEABILITY│ -     │ HIGH │
└───────────────────────────┴─────────────┴───────┴──────┘
```

---

## 5. Re-Analysis

Impact analysis can be re-run for a change request. Each run creates a new version:
- Version 1: Initial analysis
- Version 2: After dependency changes
- Version N: After scope changes

All versions are preserved for historical comparison.

---

## Document Status

| Field | Value |
|-------|-------|
| Milestone | M2 — Domain & System Design |
| Status | COMPLETE |
| Last Updated | 2026-09-10 |
