import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/index.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';

/**
 * Centralized error handler returning the approved OpenPLM error model.
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
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const requestId =
    (req.headers['x-request-id'] as string) ||
    (res.getHeader('x-request-id') as string) ||
    res.locals.requestId ||
    'unknown';

  // Handle malformed JSON body errors from express.json()
  if (
    err instanceof SyntaxError &&
    'status' in err &&
    err.status === 400 &&
    'body' in err
  ) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid JSON payload in request body',
        requestId,
      },
    });
    return;
  }

  // Handle known operational application errors
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({
        message: err.message,
        code: err.code,
        statusCode: err.statusCode,
        requestId,
        operation: `${req.method} ${req.path}`,
        stack: err.stack,
      });
    } else {
      logger.warn({
        message: err.message,
        code: err.code,
        statusCode: err.statusCode,
        requestId,
        operation: `${req.method} ${req.path}`,
      });
    }

    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details !== undefined ? { details: err.details } : {}),
        requestId,
      },
    });
    return;
  }

  // Unexpected non-operational error: Convert to safe generic 500 response
  logger.error({
    message: err.message,
    requestId,
    operation: `${req.method} ${req.path}`,
    stack: err.stack,
  });

  const isProduction = config.NODE_ENV === 'production';

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An internal error occurred',
      ...(!isProduction ? { details: { originalMessage: err.message } } : {}),
      requestId,
    },
  });
}
