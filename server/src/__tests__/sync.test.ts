import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app';

describe('Sync API', () => {
  let token: string;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'syncuser', password: 'password123' });
    token = res.body.token;
  });

  it('should push habits to server', async () => {
    const res = await request(app)
      .post('/api/sync/push')
      .set('Authorization', `Bearer ${token}`)
      .send({
        habits: [
          { id: '1', title: 'Test Habit 1', completedDates: ['2023-10-01'] },
          { id: '2', title: 'Test Habit 2', completedDates: [] }
        ]
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should pull habits from server', async () => {
    await request(app)
      .post('/api/sync/push')
      .set('Authorization', `Bearer ${token}`)
      .send({
        habits: [
          { id: '1', title: 'Test Habit 1', completedDates: ['2023-10-01'] }
        ]
      });

    const res = await request(app)
      .get('/api/sync/pull')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.habits).toHaveLength(1);
    expect(res.body.habits[0].title).toBe('Test Habit 1');
    expect(res.body.habits[0].completedDates).toEqual(['2023-10-01']);
  });
});
