# OpenPLM — Golden Scenario

## Purpose
The complete end-to-end golden path that must remain executable and testable throughout development. This scenario validates that all core features work together.

---

## Scenario: Camera Firmware Upgrade in Smart Access Control System

### Context
An engineering team manages the SAC-001 Smart Access Control System. A firmware update for the camera module triggers a change that must be analyzed, reviewed, approved, and released through the engineering process.

---

### Step 1: Authentication
```
Engineer logs in with valid credentials
→ System issues access token + refresh token
→ Engineer is authenticated with ENGINEER role
```

### Step 2: Create Product
```
Engineer creates product:
  Product Number: SAC-001
  Name: Smart Access Control System
  Description: Integrated access control system with facial authentication
→ System creates product with initial revision (Rev A, DRAFT)
→ Audit: PRODUCT_CREATED
```

### Step 3: Create Components
```
Engineer creates components:
  CTRL-001  Main Controller
  PROC-001  Processor
  FW-001    Controller Firmware
  CAM-001   Camera Assembly
  CSEN-001  Camera Sensor
  CFW-001   Camera Firmware
  IR-001    IR Sensor
  LOCK-001  Door Lock
  PWR-001   Power Supply
  COM-001   Communication Module

Each component gets initial revision (Rev A, DRAFT)
→ Audit: COMPONENT_CREATED × 10
```

### Step 4: Build BOM
```
Engineer builds BOM for SAC-001 Rev A:

  SAC-001 Rev A
  ├── CTRL-001 Rev A (qty: 1)    Main Controller
  │   ├── PROC-001 Rev A (qty: 1)    Processor
  │   └── FW-001 Rev A (qty: 1)      Controller Firmware
  ├── CAM-001 Rev A (qty: 1)    Camera Assembly
  │   ├── CSEN-001 Rev A (qty: 1)    Camera Sensor
  │   └── CFW-001 Rev A (qty: 1)     Camera Firmware
  ├── IR-001 Rev A (qty: 2)     IR Sensor
  ├── LOCK-001 Rev A (qty: 1)   Door Lock
  ├── PWR-001 Rev A (qty: 1)    Power Supply
  └── COM-001 Rev A (qty: 1)    Communication Module

→ Audit: BOM_MODIFIED
```

### Step 5: Create Requirements
```
Engineer creates requirements:
  REQ-001  System shall support facial authentication
  REQ-002  Authentication response shall be below 1 second
  REQ-003  Facial authentication shall work under low-light conditions
  REQ-004  Unauthorized access attempts shall be logged

Engineer links requirements:
  REQ-001 → SAC-001 Rev A, CAM-001 Rev A, CFW-001 Rev A
  REQ-002 → SAC-001 Rev A, CTRL-001 Rev A, CFW-001 Rev A
  REQ-003 → CAM-001 Rev A, CSEN-001 Rev A, CFW-001 Rev A
  REQ-004 → SAC-001 Rev A, CTRL-001 Rev A
```

### Step 6: Define Dependencies
```
Engineer defines dependencies:
  CFW-001 Rev A  —DEPENDS_ON→  CAM-001 Rev A
  CAM-001 Rev A  —PART_OF→     CTRL-001 Rev A
  CTRL-001 Rev A —PART_OF→     SAC-001 Rev A
  FW-001 Rev A   —DEPENDS_ON→  PROC-001 Rev A
  PROC-001 Rev A —PART_OF→     CTRL-001 Rev A

→ System validates no cycles
→ Audit: DEPENDENCY_CREATED × 5
```

### Step 7: Release Baseline
```
Engineer transitions all revisions through lifecycle:
  DRAFT → PROTOTYPING → IN_REVIEW → APPROVED → RELEASED

All Rev A revisions are now RELEASED and immutable.
SAC-001 Rev A BOM is the released baseline.
```

### Step 8: Propose Change — Camera Firmware Upgrade
```
Engineer creates Camera Firmware Rev B (DRAFT)
Engineer creates change request:
  CR-0012
  Title: Upgrade Camera Firmware to Rev C for low-light improvement
  Description: Camera firmware update to improve facial recognition in low-light conditions
  Reason: Customer feedback on REQ-003 compliance
  Priority: HIGH
  
Engineer adds change item:
  Target: CFW-001 (Camera Firmware)
  From: Rev A
  To: Rev B (new revision)

→ Audit: CHANGE_CREATED
```

### Step 9: Run Impact Analysis
```
Engineer triggers impact analysis for CR-0012:

System traverses dependency graph from CFW-001:
  CFW-001 → CAM-001 → CTRL-001 → SAC-001

System checks requirement traceability:
  CFW-001 traces to: REQ-001, REQ-002, REQ-003

Impact Report:
  ┌─────────────────────────────────────────────┐
  │ IMPACT ANALYSIS — CR-0012                   │
  │ Camera Firmware Rev A → Rev B               │
  ├─────────────────────────────────────────────┤
  │ DIRECT IMPACT (depth 1)                     │
  │   • CAM-001 Camera Assembly                 │
  ├─────────────────────────────────────────────┤
  │ INDIRECT IMPACT (depth 2+)                  │
  │   • CTRL-001 Main Controller    (depth 2)   │
  │   • SAC-001 Smart Access Control (depth 3)  │
  ├─────────────────────────────────────────────┤
  │ TRACEABILITY                                │
  │   • REQ-001 Facial authentication           │
  │   • REQ-002 Response time                   │
  │   • REQ-003 Low-light conditions            │
  ├─────────────────────────────────────────────┤
  │ RISK: HIGH                                  │
  │ Algorithm: impact-engine v1                 │
  └─────────────────────────────────────────────┘

→ Impact analysis persisted as IA-001
→ Audit: IMPACT_ANALYSIS_RUN
```

### Step 10: Submit Change for Review
```
Engineer submits CR-0012
→ Change transitions: DRAFT → SUBMITTED → IMPACT_ANALYSIS → UNDER_REVIEW
→ Workflow instance created
→ Review task assigned to Reviewer
→ Audit: CHANGE_SUBMITTED
```

### Step 11: Review & Approval
```
Reviewer logs in
→ Sees pending review task for CR-0012
→ Examines impact report
→ Reviews affected requirements (REQ-001, REQ-002, REQ-003)
→ Approves change

→ Change transitions: UNDER_REVIEW → APPROVED
→ Task marked COMPLETED
→ Audit: CHANGE_APPROVED
```

### Step 12: Implementation
```
Engineer creates CFW-001 Rev B (new revision, DRAFT)
→ Implements firmware changes in Rev B
→ Updates BOM: SAC-001 Rev B references CFW-001 Rev B
→ Change transitions: APPROVED → IMPLEMENTED
→ Audit: CHANGE_IMPLEMENTED
```

### Step 13: Verification
```
Engineer verifies:
  ✓ CFW-001 Rev B firmware functions correctly
  ✓ CAM-001 operates with new firmware
  ✓ REQ-001 still satisfied
  ✓ REQ-002 still satisfied
  ✓ REQ-003 improved (low-light performance better)
  ✓ No regression on REQ-004

→ Change transitions: IMPLEMENTED → VERIFIED
```

### Step 14: Release
```
Engineer releases:
  CFW-001 Rev B → RELEASED
  SAC-001 Rev B → RELEASED

→ Change transitions: VERIFIED → RELEASED
→ Audit: REVISION_RELEASED × 2
```

### Step 15: Verify Audit Trail
```
Administrator views audit history for CR-0012:
  CHANGE_CREATED        2026-09-10 10:00
  IMPACT_ANALYSIS_RUN   2026-09-10 10:05
  CHANGE_SUBMITTED      2026-09-10 10:10
  CHANGE_APPROVED       2026-09-10 14:30
  CHANGE_IMPLEMENTED    2026-09-10 15:00
  REVISION_RELEASED     2026-09-10 16:00

All actions are traceable, timestamped, and attributed.
```

---

## Validation Checkpoints

This scenario validates:
- [x] Authentication & authorization
- [x] Product creation with revision
- [x] Component creation with revision
- [x] BOM construction with hierarchy
- [x] Requirement creation and linking
- [x] Dependency definition
- [x] Lifecycle transitions
- [x] Revision immutability
- [x] Change request creation
- [x] Impact analysis with graph traversal
- [x] Impact classification (DIRECT, INDIRECT, TRACEABILITY)
- [x] Workflow with task assignment
- [x] Reviewer approval
- [x] Change implementation
- [x] Verification and release
- [x] Complete audit trail

---

## Document Status

| Field | Value |
|-------|-------|
| Milestone | M1 — Requirements Engineering |
| Status | COMPLETE |
| Last Updated | 2026-09-10 |
