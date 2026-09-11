# OpenPLM — Security Architecture

## Purpose
Defines authentication, authorization, and security principles for OpenPLM.

---

## 1. Authentication

### Flow
```
Login Request (email + password)
    │
    ▼
Verify credentials (bcrypt compare)
    │
    ▼
Generate access token (JWT, short-lived ~15min)
Generate refresh token (JWT or opaque, longer-lived ~7d)
    │
    ▼
Return tokens to client
```

### Token Strategy
| Token | Purpose | Lifetime | Storage |
|-------|---------|----------|---------|
| Access Token | API authentication | ~15 minutes | Client memory |
| Refresh Token | Obtain new access token | ~7 days | HttpOnly cookie or secure storage |

### JWT Payload
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "roles": ["ENGINEER"],
  "iat": 1234567890,
  "exp": 1234568790
}
```

### Protected API Flow
```
Request with Authorization: Bearer <token>
    │
    ▼
JWT Middleware: validate signature + expiration
    │
    ▼
Extract user identity
    │
    ▼
Attach user to request context
    │
    ▼
Continue to RBAC middleware
```

---

## 2. Authorization (RBAC)

### Roles
| Role | Description |
|------|-------------|
| ADMIN | Full system access including user management |
| ENGINEER | Create/edit engineering objects, run analyses |
| REVIEWER | Review and approve/reject changes |
| VIEWER | Read-only access |

### Permission Model
Permissions are centralized strings mapped to roles. The RBAC middleware checks permissions before the route handler executes.

```typescript
// Centralized permission definition
const PERMISSIONS = {
  PRODUCT_CREATE: ['ADMIN', 'ENGINEER'],
  PRODUCT_UPDATE: ['ADMIN', 'ENGINEER'],
  PRODUCT_VIEW: ['ADMIN', 'ENGINEER', 'REVIEWER', 'VIEWER'],
  BOM_EDIT: ['ADMIN', 'ENGINEER'],
  CHANGE_APPROVE: ['ADMIN', 'REVIEWER'],
  CHANGE_REJECT: ['ADMIN', 'REVIEWER'],
  USER_MANAGE: ['ADMIN'],
  AUDIT_VIEW: ['ADMIN', 'ENGINEER', 'REVIEWER'],
  // ... etc
};
```

### Middleware Chain
```
Request → Auth Middleware → RBAC Middleware → Route Handler
```

The RBAC middleware receives the required permission as a parameter:
```typescript
router.post('/products', rbac('PRODUCT_CREATE'), createProduct);
```

---

## 3. Security Principles

### Must Do
| Principle | Implementation |
|-----------|---------------|
| Hash passwords | bcrypt with appropriate salt rounds |
| Validate input | Zod schemas at API boundary |
| Enforce server-side auth | JWT + RBAC middleware on all protected routes |
| Parameterized queries | Prisma handles this automatically |
| Set security headers | Helmet middleware |
| Configure CORS | Whitelist approved origins |
| Rate limiting | Consider for auth endpoints |
| Request ID tracking | Unique ID per request for audit trail |

### Must NOT Do
| Anti-Pattern | Why |
|-------------|-----|
| Store plaintext passwords | Security 101 |
| Trust client-side authorization | Frontend can be bypassed |
| Allow frontend-only permission enforcement | Server must be authoritative |
| Bypass domain rules for internal endpoints | Rules apply universally |
| Expose secrets in source control | Use environment variables |
| Expose stack traces in production | Use generic error messages |

---

## 4. Audit Integration

Security-relevant actions are recorded in the audit trail:
- Login attempts (success/failure)
- Role assignments
- Permission-sensitive operations
- Change approvals/rejections

---

## Document Status

| Field | Value |
|-------|-------|
| Milestone | M2 — Domain & System Design |
| Status | COMPLETE |
| Last Updated | 2026-09-10 |
