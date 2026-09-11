# OpenPLM — BOM Comparison Design

## Purpose
Defines the BOM comparison algorithm for identifying differences between two BOM versions.

---

## 1. Input

Two BOM versions (typically from two revisions of the same product):
- **BOM A** (e.g., SAC-001 Rev A)
- **BOM B** (e.g., SAC-001 Rev B)

---

## 2. Pipeline

```
BOM A + BOM B
    │
    ▼
Normalize Structures
    │  (flatten hierarchy, create comparable keys)
    ▼
Match Items
    │  (pair items by component identity)
    ▼
Compare Component Revisions
    │  (same component, different revision?)
    ▼
Compare Quantities
    │  (same component+revision, different quantity?)
    ▼
Compare Parent Relationships
    │  (same item, different parent in hierarchy?)
    ▼
Classify
    │
    ▼
Output: { added[], removed[], modified[], unchanged[] }
```

---

## 3. Classification

| Category | Definition |
|----------|-----------|
| **ADDED** | Present in BOM B but not in BOM A |
| **REMOVED** | Present in BOM A but not in BOM B |
| **MODIFIED** | Present in both, but with different revision, quantity, or position |
| **UNCHANGED** | Identical in both BOMs |

---

## 4. Matching Strategy

Items are matched by **component identity** (component ID), not by position:

```
BOM A Item: CTRL-001 Rev A, qty 1
BOM B Item: CTRL-001 Rev B, qty 1
→ MODIFIED (revision changed from A to B)

BOM A Item: IR-001 Rev A, qty 2
BOM B: (no IR-001)
→ REMOVED

BOM B Item: WIFI-001 Rev A, qty 1
BOM A: (no WIFI-001)
→ ADDED
```

---

## 5. Output Structure

```typescript
interface BOMComparisonResult {
  bomA: { id: string; productRevisionId: string };
  bomB: { id: string; productRevisionId: string };
  added: BOMComparisonItem[];
  removed: BOMComparisonItem[];
  modified: BOMComparisonModifiedItem[];
  unchanged: BOMComparisonItem[];
  summary: {
    totalAdded: number;
    totalRemoved: number;
    totalModified: number;
    totalUnchanged: number;
  };
}

interface BOMComparisonItem {
  componentId: string;
  componentNumber: string;
  componentName: string;
  revisionId: string;
  revisionDisplayCode: string;
  quantity: number;
}

interface BOMComparisonModifiedItem {
  componentId: string;
  componentNumber: string;
  componentName: string;
  before: { revisionDisplayCode: string; quantity: number };
  after: { revisionDisplayCode: string; quantity: number };
  changes: string[];  // e.g., ["REVISION_CHANGED", "QUANTITY_CHANGED"]
}
```

---

## 6. Integration with Impact Analysis

BOM comparison can feed into change-impact analysis:
- ADDED items may introduce new dependencies
- REMOVED items may resolve existing impacts
- MODIFIED items (especially revision changes) are the primary trigger for impact analysis

---

## Document Status

| Field | Value |
|-------|-------|
| Milestone | M2 — Domain & System Design |
| Status | COMPLETE |
| Last Updated | 2026-09-10 |
