import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/index.js';
import { requestIdMiddleware } from './middleware/request-id.js';
import { errorHandler } from './middleware/error-handler.js';
import { v1Router } from './api/v1/router.js';
import { API_BASE_PATH } from '@openplm/shared';

/**
 * Creates and configures the Express application.
 * Separated from server startup for testability.
 */
export function createApp(): express.Application {
  const app = express();

  // ── Security ──
  app.use(helmet());
  app.use(
    cors({
      origin: config.CORS_ORIGIN,
      credentials: true,
    }),
  );

  // ── Body parsing ──
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ── Observability ──
  app.use(requestIdMiddleware);

  // ── API Routes ──
  app.use(API_BASE_PATH, v1Router);

  // ── Error handling ──
  app.use(errorHandler);

  return app;
}
