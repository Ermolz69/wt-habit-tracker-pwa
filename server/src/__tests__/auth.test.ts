import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });

    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.username).toBe('testuser');
    expect(res.body).toHaveProperty('token');
  });

  it('should not register user with same username', async () => {
    await request(app).post('/api/auth/register').send({ username: 'testuser', password: 'password123' });
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should login an existing user', async () => {
    await request(app).post('/api/auth/register').send({ username: 'testuser', password: 'password123' });
    
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should get user profile with valid token', async () => {
    const regRes = await request(app).post('/api/auth/register').send({ username: 'testuser', password: 'password123' });
    const token = regRes.body.token;

    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.username).toBe('testuser');
  });
});
