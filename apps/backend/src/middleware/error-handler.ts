import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

/**
 * Centralized error handler returning the approved error model.
 *
 * Error format:
 * {
 *   "error": {
 *     "code": "ERROR_CODE",
 *     "message": "Human-readable message",
 *     "details": { ... },
 *     "requestId": "..."
 *   }
 * }
 */
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  const requestId = req.headers['x-request-id'] as string;

  logger.error({
    message: err.message,
    requestId,
    stack: err.stack,
    operation: `${req.method} ${req.path}`,
  });

  const statusCode = 'statusCode' in err ? (err as Error & { statusCode: number }).statusCode : 500;
  const code = 'code' in err ? (err as Error & { code: string }).code : 'INTERNAL_ERROR';
  const details = 'details' in err ? (err as Error & { details: unknown }).details : undefined;

  res.status(statusCode).json({
    error: {
      code,
      message: statusCode === 500 ? 'An internal error occurred' : err.message,
      details,
      requestId,
    },
  });
}
