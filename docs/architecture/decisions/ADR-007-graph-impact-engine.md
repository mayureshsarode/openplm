# ADR-007: Dedicated Graph & Impact Analysis Engine

## Status
ACCEPTED

## Context
Impact analysis requires graph traversal algorithms (BFS, DFS, cycle detection, topological sort). These algorithms need to operate on a graph built from dependency data.

## Decision
Create a **dedicated analysis engine module** (`domain/analysis-engine/`) that has no dependencies on Prisma, Express, or any infrastructure framework. It operates on pure in-memory graph data structures.

## Alternatives Considered
1. **Graph database (Neo4j)** — Rejected. Adds operational complexity; PostgreSQL + in-memory graph is sufficient for current scale.
2. **Algorithms embedded in services** — Rejected. Would scatter graph logic and make it untestable.
3. **Dedicated pure module** — Selected.

## Reasoning
- Graph algorithms are pure functions: data in, results out
- No infrastructure dependencies means algorithms are independently testable
- Separation of concerns: application layer builds the graph from DB, domain layer analyzes it
- Algorithms can be tested with synthetic graphs without database setup
- Module structure mirrors algorithm categories (graph, algorithms, bom, impact)

## Consequences
- Application layer is responsible for querying dependencies and building the graph data structure
- Analysis engine receives a pre-built graph and returns results
- All algorithm tests are pure unit tests — fast and deterministic
- The graph data structure is defined in the domain layer, not Prisma types
