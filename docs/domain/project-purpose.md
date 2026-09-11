# OpenPLM — Project Purpose & Vision

## Purpose

This document defines the project's identity, the problem it solves, its core differentiator, target users, and the boundaries of what it will and will not do.

---

## 1. Product Identity

| Field | Value |
|-------|-------|
| **Name** | OpenPLM |
| **Full Name** | Engineering Product Lifecycle & Change Intelligence Platform |
| **Type** | Web-based engineering lifecycle management platform |

### One-Line Description

> A focused engineering lifecycle platform for managing product structures, requirements, revisions, dependencies, and engineering changes with automated change-impact analysis and workflow-driven approval.

---

## 2. Core Problem

Engineering products are interconnected systems. A product may contain:

- Assemblies
- Components and component revisions
- Software / firmware
- Requirements
- Documents
- Dependencies between all of the above
- Tests
- Engineering changes
- Approval workflows

**A change to one object can affect many other objects.**

### The Central Question

> **How can an engineering team understand, control, and trace the consequences of a product change before that change is approved and released?**

This is the problem OpenPLM exists to solve.

---

## 3. Core Differentiator

> **Understand what a change affects before approving it.**

The primary technical feature is **change impact analysis over an engineering relationship/dependency graph**.

When an engineer proposes a change to a component (e.g., Camera Firmware Rev B → Rev C), the system should automatically:

1. Traverse the dependency graph
2. Identify directly affected objects (Camera Module)
3. Identify indirectly affected objects (Main Controller, Smart Access Control System)
4. Identify requirements that trace to affected objects (REQ-001, REQ-002, REQ-003)
5. Assess impact depth and risk
6. Present a clear impact report for review

This analysis happens **before** the change is approved — not after.

---

## 4. Target Users

### 4.1 Administrator
- Manage users and roles
- Manage system configuration

### 4.2 Engineer
- Create products, components, and revisions
- Manage BOMs and requirements
- Define dependencies
- Create engineering changes
- Run impact analysis
- Implement approved changes

### 4.3 Reviewer
- Review engineering changes
- Inspect impact analysis reports
- Approve or reject changes
- Complete review tasks

### 4.4 Viewer
- Read-only access to permitted engineering information

---

## 5. Core User Journey

```
Engineer logs in
    → creates Product
    → creates Product Revision
    → creates Components
    → creates Component Revisions
    → builds BOM
    → creates Requirements
    → links Requirements to engineering objects
    → defines Dependencies
    → creates Engineering Change
    → runs Impact Analysis
    → reviews impact
    → submits Change
    → Reviewer receives Task
    → Reviewer examines Impact Report
    → Reviewer approves/rejects
    → approved change is implemented
    → new revision is created where required
    → verification occurs
    → revision/change is released
    → audit history records the actions
```

This golden path must remain executable and testable throughout development.

---

## 6. Demo Product

**SAC-001 — Smart Access Control System**

### BOM Structure
```
Smart Access Control System
├── Main Controller
│   ├── Processor
│   └── Controller Firmware
├── Camera Assembly
│   ├── Camera Sensor
│   └── Camera Firmware
├── IR Sensor
├── Door Lock
├── Power Supply
└── Communication Module
```

### Example Requirements
| ID | Requirement |
|----|-------------|
| REQ-001 | System shall support facial authentication |
| REQ-002 | Authentication response shall be below 1 second |
| REQ-003 | Facial authentication shall work under low-light conditions |
| REQ-004 | Unauthorized access attempts shall be logged |

### Golden Change Scenario

**Change:** Camera Firmware Rev B → Rev C

**Expected Impact Discovery:**
| Category | Affected Objects |
|----------|-----------------|
| Direct | Camera Module |
| Indirect | Main Controller, Smart Access Control System |
| Traceability | REQ-001, REQ-002, REQ-003 |
| Potentially | Relevant tests, relevant documents |

**Workflow:**
```
Impact Analysis → Engineering Review → Approval/Rejection → Implementation → Verification → Release
```

---

## 7. Explicit Non-Goals

| Non-Goal | Rationale |
|----------|-----------|
| CAD authoring | OpenPLM manages lifecycle, not geometry |
| NX / Solid Edge clone | Not a CAD tool |
| Complete Teamcenter clone | Focused subset, not enterprise suite |
| Enterprise PLM replacement | Focused platform |
| Full ECAD system | Separate domain |
| Full scheduling system | Out of scope |
| Full quality suite | Deferred |
| Chat/collaboration platform | Out of scope |

---

## 8. Guiding Principle

> **Depth is preferred over breadth.**

OpenPLM selects a focused subset of PLM concepts and implements them deeply.

---

## Document Status

| Field | Value |
|-------|-------|
| Milestone | M0 — Domain Discovery |
| Status | COMPLETE |
| Last Updated | 2026-09-10 |
