# OpenPLM — API Design

## Purpose
Defines the REST API design for OpenPLM, including routes, conventions, error model, and pagination.

---

## 1. Base URL

```
/api/v1
```

All endpoints are prefixed with `/api/v1/`.

---

## 2. Resource Routes

### Authentication
| Method | Path | Description |
|--------|------|-------------|
| POST | `/v1/auth/register` | Register new user |
| POST | `/v1/auth/login` | Login, receive tokens |
| POST | `/v1/auth/refresh` | Refresh access token |
| POST | `/v1/auth/logout` | Invalidate refresh token |

### Users (Admin)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/users` | List users |
| GET | `/v1/users/:id` | Get user details |
| PUT | `/v1/users/:id` | Update user |
| POST | `/v1/users/:id/roles` | Assign role |
| DELETE | `/v1/users/:id/roles/:roleId` | Remove role |

### Products
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/products` | List products |
| POST | `/v1/products` | Create product |
| GET | `/v1/products/:id` | Get product details |
| PUT | `/v1/products/:id` | Update product |
| GET | `/v1/products/:id/revisions` | List product revisions |
| POST | `/v1/products/:id/revisions` | Create product revision |
| GET | `/v1/products/:id/revisions/:revId` | Get revision details |
| POST | `/v1/products/:id/revisions/:revId/transition` | Transition lifecycle state |

### Components
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/components` | List components |
| POST | `/v1/components` | Create component |
| GET | `/v1/components/:id` | Get component details |
| PUT | `/v1/components/:id` | Update component |
| GET | `/v1/components/:id/revisions` | List component revisions |
| POST | `/v1/components/:id/revisions` | Create component revision |
| GET | `/v1/components/:id/revisions/:revId` | Get revision details |
| POST | `/v1/components/:id/revisions/:revId/transition` | Transition lifecycle state |

### BOMs
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/boms/:productRevisionId` | Get BOM for product revision |
| POST | `/v1/boms` | Create BOM |
| POST | `/v1/boms/:id/items` | Add BOM item |
| PUT | `/v1/boms/:id/items/:itemId` | Update BOM item |
| DELETE | `/v1/boms/:id/items/:itemId` | Remove BOM item |
| GET | `/v1/boms/compare` | Compare two BOMs |

### Requirements
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/requirements` | List requirements |
| POST | `/v1/requirements` | Create requirement |
| GET | `/v1/requirements/:id` | Get requirement details |
| GET | `/v1/requirements/:id/revisions` | List revisions |
| POST | `/v1/requirements/:id/revisions` | Create revision |
| POST | `/v1/requirements/:id/revisions/:revId/links` | Create traceability link |
| DELETE | `/v1/requirements/:id/revisions/:revId/links/:linkId` | Remove link |
| GET | `/v1/requirements/:id/traceability` | Get traceability |

### Dependencies
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/dependencies` | List dependencies |
| POST | `/v1/dependencies` | Create dependency |
| GET | `/v1/dependencies/:id` | Get dependency details |
| DELETE | `/v1/dependencies/:id` | Delete dependency |
| GET | `/v1/dependencies/graph` | Get dependency graph |

### Change Requests
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/change-requests` | List change requests |
| POST | `/v1/change-requests` | Create change request |
| GET | `/v1/change-requests/:id` | Get change request details |
| PUT | `/v1/change-requests/:id` | Update change request |
| POST | `/v1/change-requests/:id/items` | Add change item |
| POST | `/v1/change-requests/:id/submit` | Submit for review |
| POST | `/v1/change-requests/:id/analyze-impact` | Run impact analysis |
| POST | `/v1/change-requests/:id/approve` | Approve |
| POST | `/v1/change-requests/:id/reject` | Reject |
| POST | `/v1/change-requests/:id/implement` | Mark implemented |
| POST | `/v1/change-requests/:id/verify` | Mark verified |
| POST | `/v1/change-requests/:id/release` | Release |

### Impact Analysis
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/change-requests/:id/impact-analysis` | Get impact analysis |
| GET | `/v1/impact-analyses/:id` | Get analysis by ID |
| GET | `/v1/impact-analyses/:id/results` | Get impact results |

### Workflows
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/workflows` | List workflow definitions |
| POST | `/v1/workflows` | Create workflow definition |
| GET | `/v1/workflows/:id` | Get workflow details |
| GET | `/v1/workflows/instances/:id` | Get workflow instance |

### Tasks
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/tasks` | List tasks (filtered by assignee) |
| GET | `/v1/tasks/:id` | Get task details |
| POST | `/v1/tasks/:id/complete` | Complete task |
| POST | `/v1/tasks/:id/cancel` | Cancel task |

### Documents
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/documents` | List documents |
| POST | `/v1/documents` | Create document |
| GET | `/v1/documents/:id` | Get document details |
| GET | `/v1/documents/:id/revisions` | List revisions |
| POST | `/v1/documents/:id/revisions` | Create revision |

### Search
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/search` | Global search across entity types |

### Audit
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/audit` | List audit events (paginated) |
| GET | `/v1/audit/entity/:type/:id` | Get audit for specific entity |

### Health
| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/health` | Health check |

---

## 3. Response Conventions

### Success Response
```json
{
  "data": { ... },
  "meta": {
    "requestId": "abc-123"
  }
}
```

### List Response (Paginated)
```json
{
  "data": [ ... ],
  "meta": {
    "requestId": "abc-123",
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalItems": 150,
      "totalPages": 8
    }
  }
}
```

### Error Response
```json
{
  "error": {
    "code": "INVALID_STATE_TRANSITION",
    "message": "A released revision cannot transition to DRAFT.",
    "details": {
      "from": "RELEASED",
      "to": "DRAFT"
    },
    "requestId": "abc-123"
  }
}
```

---

## 4. Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| VALIDATION_ERROR | 400 | Input validation failed |
| INVALID_STATE_TRANSITION | 400 | Lifecycle/workflow transition not allowed |
| IMMUTABLE_REVISION | 400 | Cannot modify released revision |
| DUPLICATE_DEPENDENCY | 400 | Dependency already exists |
| SELF_DEPENDENCY | 400 | Source equals target |
| CYCLE_DETECTED | 400 | Circular dependency detected |
| INVALID_QUANTITY | 400 | BOM item quantity ≤ 0 |
| IMPACT_ANALYSIS_REQUIRED | 400 | Cannot approve without impact analysis |
| UNAUTHORIZED | 401 | Authentication required |
| FORBIDDEN | 403 | Insufficient permissions |
| ENTITY_NOT_FOUND | 404 | Requested entity does not exist |
| DUPLICATE_ENTITY | 409 | Entity with same unique key exists |
| INTERNAL_ERROR | 500 | Unexpected server error |

---

## 5. Query Parameters

### Pagination
```
?page=1&pageSize=20
```

### Filtering
```
?status=DRAFT&priority=HIGH
```

### Sorting
```
?sortBy=createdAt&sortOrder=desc
```

### Search
```
?q=camera+firmware
```

---

## Document Status

| Field | Value |
|-------|-------|
| Milestone | M2 — Domain & System Design |
| Status | COMPLETE |
| Last Updated | 2026-09-10 |
