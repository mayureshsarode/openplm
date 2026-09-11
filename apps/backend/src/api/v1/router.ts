import { Router } from 'express';
import { healthRouter } from './health.router.js';

const v1Router = Router();

// Mount route modules
v1Router.use('/health', healthRouter);

// Future routes will be mounted here:
// v1Router.use('/auth', authRouter);
// v1Router.use('/products', productsRouter);
// v1Router.use('/components', componentsRouter);
// v1Router.use('/boms', bomsRouter);
// v1Router.use('/requirements', requirementsRouter);
// v1Router.use('/dependencies', dependenciesRouter);
// v1Router.use('/change-requests', changeRequestsRouter);
// v1Router.use('/impact-analyses', impactAnalysesRouter);
// v1Router.use('/workflows', workflowsRouter);
// v1Router.use('/tasks', tasksRouter);
// v1Router.use('/documents', documentsRouter);
// v1Router.use('/search', searchRouter);
// v1Router.use('/audit', auditRouter);

export { v1Router };
