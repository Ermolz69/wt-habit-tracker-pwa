import { describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Auth API', () => {
  it('registers a new user and sets auth cookie', async () => {
    const response = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      password: 'password123',
    });

    expect(response.status).toBe(201);
    expect(response.body.user).toHaveProperty('id');
    expect(response.body.user.username).toBe('testuser');
    expect(response.body).toHaveProperty('token');
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('rejects duplicate usernames', async () => {
    await request(app).post('/api/auth/register').send({
      username: 'testuser',
      password: 'password123',
    });

    const response = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      password: 'password123',
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Username already exists');
  });

  it('logs in an existing user', async () => {
    await request(app).post('/api/auth/register').send({
      username: 'testuser',
      password: 'password123',
    });

    const response = await request(app).post('/api/auth/login').send({
      username: 'testuser',
      password: 'password123',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('returns user profile with bearer token', async () => {
    const registerResponse = await request(app).post('/api/auth/register').send({
      username: 'testuser',
      password: 'password123',
    });

    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${registerResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body.username).toBe('testuser');
  });

  it('returns user profile with cookie token', async () => {
    const agent = request.agent(app);

    await agent.post('/api/auth/register').send({
      username: 'testuser',
      password: 'password123',
    });

    const response = await agent.get('/api/auth/me');

    expect(response.status).toBe(200);
    expect(response.body.username).toBe('testuser');
  });
});
