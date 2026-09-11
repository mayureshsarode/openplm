# ADR-009: Role-Based Access Control (RBAC)

## Status
ACCEPTED

## Context
OpenPLM has four user roles (Admin, Engineer, Reviewer, Viewer) with different access levels. Authorization must be enforced consistently across all endpoints.

## Decision
Use **centralized RBAC** with permission strings mapped to roles. Authorization is enforced via middleware on the server side.

## Alternatives Considered
1. **Attribute-Based Access Control (ABAC)** — More flexible but more complex. Not justified for four roles.
2. **Per-endpoint ad-hoc checks** — Rejected. Leads to inconsistent enforcement and scattered logic.
3. **Centralized RBAC** — Selected.

## Reasoning
- Four roles with clear permission boundaries
- Centralized permission map is easy to audit and maintain
- Middleware-based enforcement ensures consistency
- Server-side enforcement is authoritative (client-side is convenience only)

## Consequences
- Permission-to-role mapping defined in a single location
- RBAC middleware receives required permission as parameter
- Adding new permissions requires updating the centralized map
- Frontend can read user roles for UI control, but server enforces
