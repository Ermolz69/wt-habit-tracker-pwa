import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('App wiring', () => {
  it('responds to health checks', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('allows configured frontend origins through CORS', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:5173');

    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });

  it('rejects unexpected origins through the global error handler', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('Origin', 'https://evil.example');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Internal server error' });
  });
});
