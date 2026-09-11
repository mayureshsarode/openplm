# OpenPLM — Database Design

## Purpose
Defines the PostgreSQL physical model: tables, constraints, indexes, and transaction principles.

---

## 1. Tables

### Identity Tables
```sql
users
  id              UUID        PK
  email           VARCHAR     UNIQUE NOT NULL
  password_hash   VARCHAR     NOT NULL
  first_name      VARCHAR     NOT NULL
  last_name       VARCHAR     NOT NULL
  is_active       BOOLEAN     DEFAULT true
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()

roles
  id              UUID        PK
  name            VARCHAR     UNIQUE NOT NULL
  description     VARCHAR
  permissions     TEXT[]
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()

user_roles
  user_id         UUID        FK → users
  role_id         UUID        FK → roles
  assigned_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
  PK (user_id, role_id)
```

### Product Tables
```sql
products
  id              UUID        PK
  product_number  VARCHAR     UNIQUE NOT NULL
  name            VARCHAR     NOT NULL
  description     TEXT
  created_by      UUID        FK → users
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()

product_revisions
  id              UUID        PK
  product_id      UUID        FK → products NOT NULL
  revision_number INTEGER     NOT NULL
  display_code    VARCHAR     NOT NULL
  status          VARCHAR     NOT NULL DEFAULT 'DRAFT'
  description     TEXT
  created_by      UUID        FK → users
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  UNIQUE (product_id, revision_number)
```

### Component Tables
```sql
components
  id              UUID        PK
  component_number VARCHAR    UNIQUE NOT NULL
  name            VARCHAR     NOT NULL
  type            VARCHAR
  description     TEXT
  created_by      UUID        FK → users
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()

component_revisions
  id              UUID        PK
  component_id    UUID        FK → components NOT NULL
  revision_number INTEGER     NOT NULL
  display_code    VARCHAR     NOT NULL
  status          VARCHAR     NOT NULL DEFAULT 'DRAFT'
  description     TEXT
  created_by      UUID        FK → users
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  UNIQUE (component_id, revision_number)
```

### BOM Tables
```sql
boms
  id                    UUID    PK
  product_revision_id   UUID    FK → product_revisions UNIQUE NOT NULL
  created_by            UUID    FK → users
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()

bom_items
  id                    UUID    PK
  bom_id                UUID    FK → boms NOT NULL
  component_revision_id UUID    FK → component_revisions NOT NULL
  parent_bom_item_id    UUID    FK → bom_items (nullable)
  quantity              INTEGER NOT NULL CHECK (quantity > 0)
  position              INTEGER
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

### Requirement Tables
```sql
requirements
  id                  UUID    PK
  requirement_number  VARCHAR UNIQUE NOT NULL
  title               VARCHAR NOT NULL
  priority            VARCHAR
  created_by          UUID    FK → users
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()

requirement_revisions
  id                  UUID    PK
  requirement_id      UUID    FK → requirements NOT NULL
  revision_number     INTEGER NOT NULL
  display_code        VARCHAR NOT NULL
  content             TEXT    NOT NULL
  status              VARCHAR NOT NULL DEFAULT 'DRAFT'
  created_by          UUID    FK → users
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
  UNIQUE (requirement_id, revision_number)

requirement_product_links
  requirement_revision_id UUID  FK → requirement_revisions
  product_revision_id     UUID  FK → product_revisions
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
  PK (requirement_revision_id, product_revision_id)

requirement_component_links
  requirement_revision_id UUID  FK → requirement_revisions
  component_revision_id   UUID  FK → component_revisions
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
  PK (requirement_revision_id, component_revision_id)
```

### Dependency Tables
```sql
dependencies
  id                UUID    PK
  source_type       VARCHAR NOT NULL
  source_id         UUID    NOT NULL
  target_type       VARCHAR NOT NULL
  target_id         UUID    NOT NULL
  relationship_type VARCHAR NOT NULL
  metadata          JSONB
  created_by        UUID    FK → users
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
  UNIQUE (source_type, source_id, target_type, target_id, relationship_type)
```

### Change Management Tables
```sql
change_requests
  id              UUID    PK
  change_number   VARCHAR UNIQUE NOT NULL
  title           VARCHAR NOT NULL
  description     TEXT
  reason          TEXT
  priority        VARCHAR
  status          VARCHAR NOT NULL DEFAULT 'DRAFT'
  requested_by    UUID    FK → users
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()

change_items
  id                UUID    PK
  change_request_id UUID    FK → change_requests NOT NULL
  entity_type       VARCHAR NOT NULL
  entity_id         UUID    NOT NULL
  from_revision_id  UUID
  to_revision_id    UUID
  description       VARCHAR
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()

impact_analyses
  id                UUID    PK
  change_request_id UUID    FK → change_requests NOT NULL
  version           INTEGER NOT NULL
  status            VARCHAR NOT NULL DEFAULT 'PENDING'
  algorithm_version VARCHAR NOT NULL
  started_at        TIMESTAMPTZ
  completed_at      TIMESTAMPTZ
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()

impact_results
  id                  UUID    PK
  impact_analysis_id  UUID    FK → impact_analyses NOT NULL
  entity_type         VARCHAR NOT NULL
  entity_id           UUID    NOT NULL
  entity_name         VARCHAR
  impact_type         VARCHAR NOT NULL
  depth               INTEGER
  risk_level          VARCHAR
  details             JSONB
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

### Workflow Tables
```sql
workflow_definitions
  id          UUID    PK
  name        VARCHAR UNIQUE NOT NULL
  description VARCHAR
  is_active   BOOLEAN DEFAULT true
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()

workflow_states
  id                      UUID    PK
  workflow_definition_id  UUID    FK → workflow_definitions NOT NULL
  name                    VARCHAR NOT NULL
  state_type              VARCHAR NOT NULL
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()

workflow_transitions
  id                      UUID    PK
  workflow_definition_id  UUID    FK → workflow_definitions NOT NULL
  from_state_id           UUID    FK → workflow_states NOT NULL
  to_state_id             UUID    FK → workflow_states NOT NULL
  name                    VARCHAR
  required_permission     VARCHAR
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()

workflow_instances
  id                      UUID    PK
  workflow_definition_id  UUID    FK → workflow_definitions NOT NULL
  current_state_id        UUID    FK → workflow_states NOT NULL
  entity_type             VARCHAR NOT NULL
  entity_id               UUID    NOT NULL
  started_at              TIMESTAMPTZ NOT NULL
  completed_at            TIMESTAMPTZ
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()

workflow_tasks
  id                    UUID    PK
  workflow_instance_id  UUID    FK → workflow_instances NOT NULL
  assigned_to           UUID    FK → users NOT NULL
  task_type             VARCHAR NOT NULL
  status                VARCHAR NOT NULL DEFAULT 'PENDING'
  description           VARCHAR
  due_date              TIMESTAMPTZ
  completed_at          TIMESTAMPTZ
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

### Document Tables
```sql
documents
  id              UUID    PK
  document_number VARCHAR UNIQUE NOT NULL
  title           VARCHAR NOT NULL
  type            VARCHAR
  created_by      UUID    FK → users
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()

document_revisions
  id              UUID    PK
  document_id     UUID    FK → documents NOT NULL
  revision_number INTEGER NOT NULL
  display_code    VARCHAR NOT NULL
  status          VARCHAR NOT NULL DEFAULT 'DRAFT'
  content         TEXT
  created_by      UUID    FK → users
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  UNIQUE (document_id, revision_number)
```

### Audit Table
```sql
audit_events
  id              UUID    PK
  actor_id        UUID    FK → users
  action          VARCHAR NOT NULL
  entity_type     VARCHAR NOT NULL
  entity_id       UUID    NOT NULL
  previous_state  JSONB
  new_state       JSONB
  metadata        JSONB
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
```

> Audit events are **append-only**. No UPDATE or DELETE operations are permitted on this table for normal application users.

---

## 2. Indexes

Based on expected access patterns:

```sql
-- Products
CREATE INDEX idx_products_product_number ON products(product_number);

-- Components
CREATE INDEX idx_components_component_number ON components(component_number);

-- Revisions
CREATE INDEX idx_product_revisions_product_id ON product_revisions(product_id, revision_number);
CREATE INDEX idx_component_revisions_component_id ON component_revisions(component_id, revision_number);
CREATE INDEX idx_requirement_revisions_requirement_id ON requirement_revisions(requirement_id, revision_number);

-- BOM
CREATE INDEX idx_bom_items_bom_id ON bom_items(bom_id);
CREATE INDEX idx_bom_items_parent ON bom_items(parent_bom_item_id);
CREATE INDEX idx_bom_items_component_revision ON bom_items(component_revision_id);

-- Changes
CREATE INDEX idx_change_requests_number ON change_requests(change_number);
CREATE INDEX idx_change_requests_status ON change_requests(status);
CREATE INDEX idx_change_items_cr_id ON change_items(change_request_id);

-- Impact
CREATE INDEX idx_impact_analyses_cr_id ON impact_analyses(change_request_id);
CREATE INDEX idx_impact_results_analysis_id ON impact_results(impact_analysis_id);

-- Workflow
CREATE INDEX idx_workflow_tasks_assigned ON workflow_tasks(assigned_to, status);

-- Audit
CREATE INDEX idx_audit_events_entity ON audit_events(entity_type, entity_id);
CREATE INDEX idx_audit_events_created ON audit_events(created_at);
```

---

## 3. Transaction Boundaries

| Use Case | Transaction Scope |
|----------|------------------|
| Revision creation | Create revision + copy baseline data + audit event |
| BOM modification | Validate editable + modify BOM + validate structure + audit |
| Change approval | Validate transition + validate impact + transition status + audit |
| Impact analysis | Create analysis + create results + update status + audit |
| Dependency creation | Validate entities + check cycles + create dependency + audit |

Transaction boundaries are designed per use case — no arbitrary global wrapping.

---

## Document Status

| Field | Value |
|-------|-------|
| Milestone | M3 — Physical Architecture & Database Design |
| Status | COMPLETE |
| Last Updated | 2026-09-10 |
