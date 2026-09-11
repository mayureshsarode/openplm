# ADR-005: Revision Immutability

## Status
ACCEPTED

## Context
Engineering products require baseline control. Once a revision is released, it represents a frozen engineering state that other artifacts may depend on. Allowing modification of released revisions would undermine traceability and configuration management.

## Decision
**Released revisions are immutable.** A revision in RELEASED state cannot be modified through normal application operations. To change a released object, a new revision must be created.

## Alternatives Considered
1. **Allow edits with audit trail** — Rejected. Breaks baseline integrity and complicates traceability.
2. **Soft immutability (warn but allow)** — Rejected. Engineering configuration management requires hard enforcement.
3. **Hard immutability** — Selected.

## Reasoning
- Released baselines must be trustworthy
- BOMs, dependencies, and impact analyses reference specific revisions
- Modifying a released revision would silently affect all referencing artifacts
- This is a fundamental principle of engineering configuration management
- The revision model (new revision for changes) naturally supports this

## Consequences
- Domain layer must validate lifecycle state before any modification
- API must reject modification requests for released revisions
- Frontend must disable editing controls for released revisions
- Creating a new revision is the only path to modify released content
