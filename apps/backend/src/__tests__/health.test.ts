import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../app.js';

const app = createApp();

describe('Health Endpoint', () => {
  it('GET /api/v1/health should return status ok', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('should include request-id header processing', async () => {
    const response = await request(app)
      .get('/api/v1/health')
      .set('x-request-id', 'test-request-123');

    expect(response.status).toBe(200);
  });
});
