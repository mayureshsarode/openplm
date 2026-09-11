# ADR-006: Polymorphic Dependency Representation

## Status
ACCEPTED

## Context
Dependencies in OpenPLM connect different entity types (products, components, requirements, documents). A dependency's source and target can be any engineering object type.

## Decision
Use a **polymorphic reference model** with `sourceType + sourceId` and `targetType + targetId` fields. Entity existence is validated at the application/domain layer, not through database foreign keys.

## Alternatives Considered
1. **Separate tables per relationship type** — Rejected. Would create many tables and complicate graph construction.
2. **Single polymorphic table with FK per type** — Complex and brittle.
3. **Polymorphic with application-level validation** — Selected.

## Reasoning
- A single `dependencies` table can represent all relationship types
- The graph engine needs a unified edge list — a single table simplifies graph construction
- PostgreSQL FK constraints cannot reference multiple target tables from one column
- Application-level validation ensures referenced entities exist
- Unique constraint on (source_type, source_id, target_type, target_id, relationship_type) prevents duplicates

## Consequences
- No FK constraints on source/target — referential integrity relies on application logic
- Orphaned dependencies possible if entities are deleted without cleanup
- Application must validate entity existence before creating dependencies
- Graph engine receives a uniform edge list regardless of entity types
