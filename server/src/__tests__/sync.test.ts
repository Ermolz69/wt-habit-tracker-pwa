import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Sync API', () => {
  let token: string;

  beforeEach(async () => {
    const response = await request(app).post('/api/auth/register').send({
      username: 'syncuser',
      password: 'password123',
    });

    token = response.body.token;
  });

  it('pushes habits to server', async () => {
    const response = await request(app)
      .post('/api/sync/push')
      .set('Authorization', `Bearer ${token}`)
      .send({
        habits: [
          { id: '1', title: 'Test Habit 1', completedDates: ['2023-10-01'], updatedAt: Date.now() },
          { id: '2', title: 'Test Habit 2', completedDates: [], updatedAt: Date.now() },
        ],
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  it('pulls habits from server', async () => {
    await request(app)
      .post('/api/sync/push')
      .set('Authorization', `Bearer ${token}`)
      .send({
        habits: [{ id: '1', title: 'Test Habit 1', completedDates: ['2023-10-01'], updatedAt: Date.now() }],
      });

    const response = await request(app)
      .get('/api/sync/pull')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.habits).toHaveLength(1);
    expect(response.body.habits[0].title).toBe('Test Habit 1');
    expect(response.body.habits[0].completedDates).toEqual(['2023-10-01']);
  });

  it('rejects unauthenticated sync requests', async () => {
    const response = await request(app).get('/api/sync/pull');

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Authentication required');
  });
});
