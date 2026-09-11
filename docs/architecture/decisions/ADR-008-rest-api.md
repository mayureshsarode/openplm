# ADR-008: REST API

## Status
ACCEPTED

## Context
The frontend needs to communicate with the backend. An API style must be chosen.

## Decision
Use **REST** with JSON over HTTP, versioned under `/api/v1/`.

## Alternatives Considered
1. **GraphQL** — Rejected. Adds complexity (schema definition, resolvers, client libraries) without sufficient justification. REST is simpler and well-understood for CRUD + action endpoints.
2. **gRPC** — Rejected. Designed for service-to-service communication, not browser clients.
3. **REST** — Selected.

## Reasoning
- Simple and well-understood
- Good tooling (OpenAPI documentation, Postman, curl)
- Natural fit for resource-oriented operations (products, components, BOMs)
- Action endpoints (submit, approve, reject) naturally map to POST
- Easy to test with Supertest

## Consequences
- Resource-oriented URL design
- Standard HTTP methods (GET, POST, PUT, DELETE)
- Consistent JSON response format
- API versioning via URL prefix
