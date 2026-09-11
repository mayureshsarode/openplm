# Contributing to OpenPLM

Thank you for your interest in contributing to OpenPLM!

## Development Process

### Branch Strategy
- `main` — Stable branch, always deployable
- `feature/<name>` — Feature branches (e.g., `feature/product-lifecycle`)
- `fix/<name>` — Bug fix branches (e.g., `fix/bom-validation`)

### Workflow
1. Create a GitHub issue describing the work
2. Create a feature branch from `main`
3. Implement the changes
4. Write/update tests
5. Ensure all checks pass (lint, typecheck, tests, build)
6. Open a Pull Request
7. Request review
8. Merge after approval

### Commit Conventions
Use conventional commits:
```
feat(products): add product creation use case
feat(bom): add nested BOM items
feat(impact): implement BFS impact traversal
fix(change): reject invalid approval transition
test(graph): add cycle detection edge cases
docs(architecture): add revision immutability ADR
```

## Code Standards

### TypeScript
- Strict mode enabled
- No `any` types unless absolutely necessary (and documented)
- Use interfaces for domain objects

### Architecture
- **API Layer**: Routes, middleware, validation only — no business logic
- **Application Layer**: Use case orchestration
- **Domain Layer**: Business rules, algorithms — no infrastructure dependencies
- **Infrastructure Layer**: Database, external services

### Testing
- Write tests for all business logic
- Include edge cases and failure scenarios
- Unit tests for domain logic
- Integration tests for API endpoints

### Code Style
- ESLint and Prettier are configured — run `npm run lint` before committing
- Follow existing patterns in the codebase

## Pull Request Template

Every PR should include:
1. **Summary** — What changed?
2. **Requirements** — Which FR/issue does it implement?
3. **Design** — Architectural approach used
4. **Tests** — Tests added/run
5. **Verification** — Commands run to verify
6. **Risks** — Known limitations

## Setting Up Locally

See [Local Development Guide](docs/deployment/local-development.md).
