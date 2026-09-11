# ADR-002: PostgreSQL as Primary Database

## Status
ACCEPTED

## Context
OpenPLM needs a reliable relational database that supports complex queries, transactions, JSON storage for flexible metadata, and strong data integrity through constraints.

## Decision
Use **PostgreSQL 16** as the sole database for OpenPLM.

## Alternatives Considered
1. **MongoDB** — Rejected. Engineering data has strong relational structure (products → revisions → BOMs → items). Document model would require denormalization and lose referential integrity.
2. **Neo4j / Graph database** — Rejected. While OpenPLM uses graph algorithms, the dependency graph is built in-memory from relational data. A graph DB adds operational complexity without sufficient benefit at current scale.
3. **MySQL** — Viable, but PostgreSQL offers better JSON support (JSONB), array types, and richer constraint support.
4. **PostgreSQL** — Selected.

## Reasoning
- Strong relational model matches the domain (products, revisions, BOMs, dependencies)
- JSONB support for flexible metadata (audit events, impact details, dependency metadata)
- Mature transaction support for multi-write consistency
- Rich constraint support (CHECK, UNIQUE, FK)
- Excellent Prisma ORM support
- Widely available via Docker for local development
- Proven at scale for engineering/enterprise applications

## Consequences
- All data stored in PostgreSQL (no Redis cache, no Elasticsearch for search initially)
- Graph algorithms operate on in-memory structures built from relational queries
- Search uses PostgreSQL full-text search (or LIKE/ILIKE) initially
