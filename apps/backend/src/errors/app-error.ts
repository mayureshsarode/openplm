export interface AppErrorOptions {
  statusCode: number;
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Centralized base application error class.
 * All known, operational application errors inherit from this class.
 */
export class AppError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details?: Record<string, unknown>;
  readonly isOperational: boolean;

  constructor(options: AppErrorOptions) {
    super(options.message);
    this.name = this.constructor.name;
    this.statusCode = options.statusCode;
    this.code = options.code;
    this.details = options.details;
    this.isOperational = true;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// ── HTTP 400 Client Errors ──────────────────────────────────────────────────

export class ValidationError extends AppError {
  constructor(message = 'Validation failed', details?: Record<string, unknown>) {
    super({
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      message,
      details,
    });
  }
}

export class InvalidStateTransitionError extends AppError {
  constructor(message = 'Invalid state transition', details?: Record<string, unknown>) {
    super({
      statusCode: 400,
      code: 'INVALID_STATE_TRANSITION',
      message,
      details,
    });
  }
}

export class ImmutableRevisionError extends AppError {
  constructor(
    message = 'Released revisions are immutable and cannot be modified',
    details?: Record<string, unknown>,
  ) {
    super({
      statusCode: 400,
      code: 'IMMUTABLE_REVISION',
      message,
      details,
    });
  }
}

export class DuplicateDependencyError extends AppError {
  constructor(message = 'Dependency already exists', details?: Record<string, unknown>) {
    super({
      statusCode: 400,
      code: 'DUPLICATE_DEPENDENCY',
      message,
      details,
    });
  }
}

export class SelfDependencyError extends AppError {
  constructor(
    message = 'Self-dependencies are not permitted',
    details?: Record<string, unknown>,
  ) {
    super({
      statusCode: 400,
      code: 'SELF_DEPENDENCY',
      message,
      details,
    });
  }
}

export class CycleDetectedError extends AppError {
  constructor(
    message = 'Circular dependency detected',
    details?: Record<string, unknown>,
  ) {
    super({
      statusCode: 400,
      code: 'CYCLE_DETECTED',
      message,
      details,
    });
  }
}

export class InvalidQuantityError extends AppError {
  constructor(
    message = 'BOM item quantity must be greater than zero',
    details?: Record<string, unknown>,
  ) {
    super({
      statusCode: 400,
      code: 'INVALID_QUANTITY',
      message,
      details,
    });
  }
}

export class ImpactAnalysisRequiredError extends AppError {
  constructor(
    message = 'Change request requires completed impact analysis before review or approval',
    details?: Record<string, unknown>,
  ) {
    super({
      statusCode: 400,
      code: 'IMPACT_ANALYSIS_REQUIRED',
      message,
      details,
    });
  }
}

// ── HTTP 401 / 403 / 404 / 409 Authentication & Authorization Errors ───────

export class UnauthorizedError extends AppError {
  constructor(
    message = 'Authentication required',
    details?: Record<string, unknown>,
  ) {
    super({
      statusCode: 401,
      code: 'UNAUTHORIZED',
      message,
      details,
    });
  }
}

export class ForbiddenError extends AppError {
  constructor(
    message = 'Insufficient permissions to perform this operation',
    details?: Record<string, unknown>,
  ) {
    super({
      statusCode: 403,
      code: 'FORBIDDEN',
      message,
      details,
    });
  }
}

export class NotFoundError extends AppError {
  constructor(
    message = 'Requested entity not found',
    details?: Record<string, unknown>,
  ) {
    super({
      statusCode: 404,
      code: 'ENTITY_NOT_FOUND',
      message,
      details,
    });
  }
}

export class ConflictError extends AppError {
  constructor(
    message = 'Entity with the same unique identifier already exists',
    details?: Record<string, unknown>,
  ) {
    super({
      statusCode: 409,
      code: 'DUPLICATE_ENTITY',
      message,
      details,
    });
  }
}

// ── HTTP 500 Internal Errors ────────────────────────────────────────────────

export class InternalError extends AppError {
  constructor(
    message = 'An unexpected internal error occurred',
    details?: Record<string, unknown>,
  ) {
    super({
      statusCode: 500,
      code: 'INTERNAL_ERROR',
      message,
      details,
    });
  }
}
