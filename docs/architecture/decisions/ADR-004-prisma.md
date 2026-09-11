# ADR-004: Prisma as ORM

## Status
ACCEPTED

## Context
The backend needs a data access layer for PostgreSQL that provides type safety, migrations, and a productive developer experience.

## Decision
Use **Prisma** as the ORM for database access.

## Alternatives Considered
1. **Raw SQL** — Rejected. Too much boilerplate, no type safety, manual migration management.
2. **TypeORM** — Viable but Prisma offers better TypeScript integration and developer experience.
3. **Knex.js** — Query builder, not full ORM. More flexible but more manual work.
4. **Prisma** — Selected.

## Reasoning
- Auto-generated TypeScript types from schema
- Declarative schema definition
- Built-in migration system
- Parameterized queries prevent SQL injection
- Excellent developer experience
- Good PostgreSQL support

## Consequences
- Schema defined in `schema.prisma` file (not TypeScript decorators)
- Prisma Client generated from schema
- Some complex queries may need raw SQL via `$queryRaw`
- Infrastructure layer wraps Prisma — domain layer does not import Prisma directly
