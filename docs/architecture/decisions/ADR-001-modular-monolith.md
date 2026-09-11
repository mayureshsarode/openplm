# ADR-001: Modular Monolith Architecture

## Status
ACCEPTED

## Context
OpenPLM needs an architecture that supports clear module boundaries while remaining manageable for a small team. The system has well-defined domains (Products, BOM, Requirements, Dependencies, Changes, Impact Analysis, Workflows) that need to interact efficiently.

## Decision
OpenPLM v1 uses a **modular monolith** architecture — a single deployable backend application with clear internal module boundaries enforced by directory structure and import conventions.

## Alternatives Considered
1. **Microservices** — Rejected. Adds distributed-system complexity (service discovery, inter-service communication, distributed transactions, deployment orchestration) without sufficient justification at current scale.
2. **Simple monolith** (no module boundaries) — Rejected. Risks tangled dependencies and makes future decomposition difficult.
3. **Modular monolith** — Selected. Clear boundaries without distributed complexity.

## Reasoning
- The team size and scale do not justify microservices overhead
- Shared database transactions simplify consistency (e.g., change approval + audit)
- Module boundaries can be enforced through directory structure and code review
- The architecture can be decomposed into services later if requirements justify it
- Simpler deployment, debugging, and operational model

## Consequences
- All modules share a single database
- Cross-module calls are in-process function calls (not HTTP/gRPC)
- Module boundaries must be maintained through discipline, not infrastructure
- Scaling is vertical (larger instance) rather than horizontal per-service
