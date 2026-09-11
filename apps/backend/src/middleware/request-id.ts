import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

/**
 * Maximum allowed length for a client-provided request ID.
 * Prevents oversized values from polluting logs and response headers.
 */
const MAX_REQUEST_ID_LENGTH = 128;

/**
 * Validates a request ID format.
 * Accepts alphanumeric characters, hyphens, underscores, dots, and colons.
 * Must be 1–128 characters and contain no whitespace or control characters.
 */
const REQUEST_ID_PATTERN = /^[a-zA-Z0-9\-_.:]+$/;

/**
 * Returns true if the candidate request ID is valid (correct format and bounded length).
 */
function isValidRequestId(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= MAX_REQUEST_ID_LENGTH &&
    REQUEST_ID_PATTERN.test(value)
  );
}

/**
 * Adds a unique request ID to each incoming request for observability and audit trail.
 * Sets the header on both request and response for correlation across clients and logs.
 *
 * Validates incoming `x-request-id` headers. If missing or invalid (wrong format,
 * exceeds max length), a server-generated UUID is used instead.
 */
export function requestIdMiddleware(req: Request, res: Response, next: NextFunction): void {
  const clientId = req.headers['x-request-id'];
  const requestId = isValidRequestId(clientId) ? clientId : uuidv4();
  req.headers['x-request-id'] = requestId;
  res.setHeader('x-request-id', requestId);
  res.locals.requestId = requestId;
  next();
}
