# OpenPLM — Graph Engine Design

## Purpose
Defines the graph abstraction, algorithms, and their engineering justification for OpenPLM's dependency and impact analysis system.

---

## 1. Module Structure

```
domain/analysis-engine/
├── graph/
│   ├── graph.ts            # Graph data structure
│   ├── node.ts             # Node representation
│   └── edge.ts             # Edge representation
├── algorithms/
│   ├── bfs.ts              # Breadth-first search
│   ├── dfs.ts              # Depth-first search
│   ├── cycle-detection.ts  # Cycle detection
│   └── topological-sort.ts # Topological sorting
├── bom/
│   └── bom-comparator.ts   # BOM comparison
└── impact/
    ├── impact-analyzer.ts  # Impact analysis orchestration
    ├── impact-result.ts    # Impact result types
    └── impact-rules.ts     # Impact classification rules
```

### Critical Constraint
> The graph engine **must not** depend on Prisma, Express, or any infrastructure framework. It operates on pure data structures.

---

## 2. Graph Data Structure

### Node
```typescript
interface GraphNode {
  id: string;
  type: string;       // e.g., "PRODUCT_REVISION", "COMPONENT_REVISION"
  label: string;      // Display name
  metadata?: Record<string, unknown>;
}
```

### Edge
```typescript
interface GraphEdge {
  id: string;
  source: string;     // Source node ID
  target: string;     // Target node ID
  type: string;       // Relationship type (DEPENDS_ON, PART_OF, etc.)
  metadata?: Record<string, unknown>;
}
```

### Graph
```typescript
interface Graph {
  nodes: Map<string, GraphNode>;
  edges: GraphEdge[];
  
  addNode(node: GraphNode): void;
  addEdge(edge: GraphEdge): void;
  getNeighbors(nodeId: string, direction: 'outgoing' | 'incoming' | 'both'): GraphNode[];
  getEdgesFrom(nodeId: string): GraphEdge[];
  getEdgesTo(nodeId: string): GraphEdge[];
  hasNode(nodeId: string): boolean;
  hasEdge(source: string, target: string): boolean;
}
```

---

## 3. Algorithms

### 3.1 BFS (Breadth-First Search)

**Engineering justification:** Discover downstream impact level by level. BFS naturally groups results by traversal depth, which maps to impact depth (DIRECT at depth 1, INDIRECT at depth 2+).

**Complexity:** O(V + E)

**Input:** Start node(s), graph, optional max depth  
**Output:** Visited nodes with depth information

```
BFS from changed entity:
  Depth 0: Changed entity (Camera Firmware)
  Depth 1: Direct dependents (Camera Module) → DIRECT impact
  Depth 2: Indirect dependents (Main Controller) → INDIRECT impact
  Depth 3: Further indirect (SAC-001) → INDIRECT impact
```

### 3.2 DFS (Depth-First Search)

**Engineering justification:** Explore complete dependency paths. Useful for finding all paths between two entities and for dependency exploration.

**Complexity:** O(V + E)

**Input:** Start node, graph  
**Output:** Visited nodes in DFS order, path information

### 3.3 Cycle Detection

**Engineering justification:** Prevent prohibited circular dependencies. A cycle in the dependency graph means A depends on B depends on ... depends on A, which creates unresolvable dependency chains.

**Complexity:** O(V + E)

**Algorithm:** DFS-based with three coloring states (WHITE/unvisited, GRAY/in-progress, BLACK/completed). A back edge to a GRAY node indicates a cycle.

**Input:** Graph  
**Output:** Boolean (has cycle) + cycle path if found

### 3.4 Topological Sort

**Engineering justification:** Produce a valid dependency ordering for entities that form a DAG. This determines the order in which changes should be applied — dependencies must be resolved before dependents.

**Complexity:** O(V + E)

**Precondition:** Graph must be a DAG (no cycles).

**Input:** Graph  
**Output:** Ordered list of nodes, or error if graph has cycles

---

## 4. Design Principles

1. **Every algorithm solves a real product problem.** No algorithms are included for resume value.
2. **Pure functions where possible.** Algorithms take graph data in, return results out.
3. **No infrastructure dependencies.** The engine works with in-memory graph structures built by the application layer.
4. **Documented complexity.** Each algorithm documents its time and space complexity.
5. **Comprehensive tests.** Each algorithm has tests covering normal cases, edge cases (empty graph, single node, disconnected components), and failure cases (cycles where prohibited).

---

## Document Status

| Field | Value |
|-------|-------|
| Milestone | M2 — Domain & System Design |
| Status | COMPLETE |
| Last Updated | 2026-09-10 |
