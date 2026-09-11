# ADR-003: TypeScript for Backend

## Status
ACCEPTED

## Context
The backend needs a language that supports type safety, is well-suited for Node.js/Express development, and allows code sharing with the React frontend.

## Decision
Use **TypeScript** (strict mode) for the backend.

## Alternatives Considered
1. **Java / Spring Boot** — Rejected. Different language from frontend, heavier framework, larger team needed.
2. **Plain JavaScript** — Rejected. Lacks type safety critical for domain modeling.
3. **TypeScript** — Selected.

## Reasoning
- Type safety catches errors at compile time
- Same language as frontend enables code sharing (shared types package)
- Rich ecosystem for Node.js/Express
- Strict mode enforces discipline
- Excellent IDE support and tooling

## Consequences
- TypeScript compilation step required
- Strict mode may require more explicit typing
- Shared `packages/shared/` can define common types used by both frontend and backend
