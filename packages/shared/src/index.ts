/**
 * OpenPLM Shared Types and Constants
 *
 * This package contains TypeScript types and constants shared
 * between the frontend and backend applications.
 */

// ── API Version ──
export const API_VERSION = 'v1' as const;
export const API_BASE_PATH = `/api/${API_VERSION}` as const;

// ── Health ──
export interface HealthResponse {
  status: 'ok' | 'error';
}

// ── Lifecycle States ──
export const LIFECYCLE_STATES = [
  'DRAFT',
  'PROTOTYPING',
  'IN_REVIEW',
  'APPROVED',
  'RELEASED',
  'DEPRECATED',
] as const;
export type LifecycleState = (typeof LIFECYCLE_STATES)[number];

// ── Change Request States ──
export const CHANGE_REQUEST_STATES = [
  'DRAFT',
  'SUBMITTED',
  'IMPACT_ANALYSIS',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'IMPLEMENTED',
  'VERIFIED',
  'RELEASED',
] as const;
export type ChangeRequestState = (typeof CHANGE_REQUEST_STATES)[number];

// ── Impact Types ──
export const IMPACT_TYPES = ['DIRECT', 'INDIRECT', 'TRACEABILITY'] as const;
export type ImpactType = (typeof IMPACT_TYPES)[number];

// ── Risk Levels ──
export const RISK_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
export type RiskLevel = (typeof RISK_LEVELS)[number];

// ── Relationship Types ──
export const RELATIONSHIP_TYPES = [
  'DEPENDS_ON',
  'PART_OF',
  'IMPLEMENTS',
  'TESTS',
  'DOCUMENTS',
] as const;
export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];

// ── Priority ──
export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
export type Priority = (typeof PRIORITIES)[number];

// ── Roles ──
export const ROLES = ['ADMIN', 'ENGINEER', 'REVIEWER', 'VIEWER'] as const;
export type Role = (typeof ROLES)[number];

// ── Task Status ──
export const TASK_STATUSES = [
  'PENDING',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

// ── API Error Response ──
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    requestId?: string;
  };
}

// ── Paginated Response ──
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    requestId: string;
    pagination: {
      page: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    };
  };
}
