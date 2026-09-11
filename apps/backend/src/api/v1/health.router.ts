import { Router, Request, Response } from 'express';
import type { HealthResponse } from '@openplm/shared';

const healthRouter = Router();

/**
 * GET /api/v1/health
 * Health check endpoint.
 */
healthRouter.get('/', (_req: Request, res: Response) => {
  const response: HealthResponse = { status: 'ok' };
  res.json(response);
});

export { healthRouter };
