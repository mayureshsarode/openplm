import { describe, it, expect } from 'vitest';
import express, { Request, Response } from 'express';
import request from 'supertest';
import { requestIdMiddleware } from '../middleware/request-id.js';
import { errorHandler } from '../middleware/error-handler.js';
import {
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InvalidStateTransitionError,
  ImmutableRevisionError,
  CycleDetectedError,
} from '../errors/index.js';

function createTestApp() {
  const app = express();
  app.use(express.json());
  app.use(requestIdMiddleware);

  app.get('/test/validation-error', () => {
    throw new ValidationError('Invalid product input', {
      field: 'productNumber',
      reason: 'Must match pattern',
    });
  });

  app.get('/test/unauthorized-error', () => {
    throw new UnauthorizedError('JWT token expired');
  });

  app.get('/test/forbidden-error', () => {
    throw new ForbiddenError('Only ADMIN can perform this action');
  });

  app.get('/test/not-found-error', () => {
    throw new NotFoundError('Product SAC-001 not found');
  });

  app.get('/test/conflict-error', () => {
    throw new ConflictError('Component CTRL-001 already exists');
  });

  app.get('/test/lifecycle-error', () => {
    throw new InvalidStateTransitionError(
      'Cannot transition from RELEASED to DRAFT',
      { from: 'RELEASED', to: 'DRAFT' },
    );
  });

  app.get('/test/immutable-error', () => {
    throw new ImmutableRevisionError();
  });

  app.get('/test/cycle-error', () => {
    throw new CycleDetectedError('Cycle: A -> B -> A');
  });

  app.post('/test/echo', (req: Request, res: Response) => {
    res.json({ received: req.body });
  });

  app.get('/test/unexpected-error', () => {
    throw new Error('Database disk I/O failure: /var/lib/postgresql/data');
  });

  app.use(errorHandler);
  return app;
}

const app = createTestApp();

describe('Centralized Error Handling Middleware', () => {
  it('should handle ValidationError with 400 status and details', async () => {
    const res = await request(app).get('/test/validation-error');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toEqual({
      code: 'VALIDATION_ERROR',
      message: 'Invalid product input',
      details: {
        field: 'productNumber',
        reason: 'Must match pattern',
      },
      requestId: expect.any(String),
    });
  });

  it('should handle UnauthorizedError with 401 status', async () => {
    const res = await request(app).get('/test/unauthorized-error');

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHORIZED');
    expect(res.body.error.message).toBe('JWT token expired');
    expect(res.body.error.requestId).toBeDefined();
  });

  it('should handle ForbiddenError with 403 status', async () => {
    const res = await request(app).get('/test/forbidden-error');

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
    expect(res.body.error.message).toBe('Only ADMIN can perform this action');
  });

  it('should handle NotFoundError with 404 status', async () => {
    const res = await request(app).get('/test/not-found-error');

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('ENTITY_NOT_FOUND');
    expect(res.body.error.message).toBe('Product SAC-001 not found');
  });

  it('should handle ConflictError with 409 status', async () => {
    const res = await request(app).get('/test/conflict-error');

    expect(res.status).toBe(409);
    expect(res.body.error.code).toBe('DUPLICATE_ENTITY');
    expect(res.body.error.message).toBe('Component CTRL-001 already exists');
  });

  it('should handle domain errors (InvalidStateTransition, ImmutableRevision, CycleDetected)', async () => {
    const resTransition = await request(app).get('/test/lifecycle-error');
    expect(resTransition.status).toBe(400);
    expect(resTransition.body.error.code).toBe('INVALID_STATE_TRANSITION');
    expect(resTransition.body.error.details).toEqual({
      from: 'RELEASED',
      to: 'DRAFT',
    });

    const resImmutable = await request(app).get('/test/immutable-error');
    expect(resImmutable.status).toBe(400);
    expect(resImmutable.body.error.code).toBe('IMMUTABLE_REVISION');

    const resCycle = await request(app).get('/test/cycle-error');
    expect(resCycle.status).toBe(400);
    expect(resCycle.body.error.code).toBe('CYCLE_DETECTED');
  });

  it('should handle malformed JSON body payloads as 400 VALIDATION_ERROR', async () => {
    const res = await request(app)
      .post('/test/echo')
      .set('Content-Type', 'application/json')
      .send('{ "bad_json": ');

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toBe('Invalid JSON payload in request body');
  });

  it('should convert unexpected errors into safe generic 500 response without leaking stack traces', async () => {
    const res = await request(app).get('/test/unexpected-error');

    expect(res.status).toBe(500);
    expect(res.body.error.code).toBe('INTERNAL_ERROR');
    expect(res.body.error.message).toBe('An internal error occurred');
    expect(res.body.error).not.toHaveProperty('stack');
    expect(res.body.error.requestId).toBeDefined();
  });

  it('should propagate client x-request-id across response headers and error payload', async () => {
    const customRequestId = 'trace-corr-id-998877';
    const res = await request(app)
      .get('/test/validation-error')
      .set('x-request-id', customRequestId);

    expect(res.headers['x-request-id']).toBe(customRequestId);
    expect(res.body.error.requestId).toBe(customRequestId);
  });
});
