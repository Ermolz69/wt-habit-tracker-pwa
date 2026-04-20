import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '../app';
import { createAuthToken, createHabitPayload } from './helpers';

describe('Sync API', () => {
  let token: string;

  beforeEach(async () => {
    token = await createAuthToken(app, 'sync-user');
  });

  it('pushes habits to server', async () => {
    const response = await request(app)
      .post('/api/sync/push')
      .set('Authorization', `Bearer ${token}`)
      .send({
        habits: [
          createHabitPayload({ id: '1', title: 'Test Habit 1', completedDates: ['2023-10-01'] }),
          createHabitPayload({ id: '2', title: 'Test Habit 2' }),
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
        habits: [createHabitPayload({ id: '1', title: 'Test Habit 1', completedDates: ['2023-10-01'] })],
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

  it('keeps habits missing from the next snapshot', async () => {
    await request(app)
      .post('/api/sync/push')
      .set('Authorization', `Bearer ${token}`)
      .send({
        habits: [
          createHabitPayload({ id: '1', title: 'Test Habit 1', completedDates: ['2023-10-01'] }),
          createHabitPayload({ id: '2', title: 'Test Habit 2' }),
        ],
      });

    await request(app)
      .post('/api/sync/push')
      .set('Authorization', `Bearer ${token}`)
      .send({
        habits: [createHabitPayload({ id: '2', title: 'Test Habit 2', updatedAt: Date.now() + 1 })],
      });

    const response = await request(app)
      .get('/api/sync/pull')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.habits).toHaveLength(2);
    expect(response.body.habits.map((habit: { id: string }) => habit.id)).toEqual(expect.arrayContaining(['1', '2']));
  });

  it('syncs deleted habits as tombstones', async () => {
    const deletedAt = Date.now() + 2;

    await request(app)
      .post('/api/sync/push')
      .set('Authorization', `Bearer ${token}`)
      .send({
        habits: [
          createHabitPayload({
            id: '1',
            title: 'Test Habit 1',
            completedDates: ['2023-10-01'],
            updatedAt: deletedAt,
            deletedAt,
          }),
        ],
      });

    const response = await request(app)
      .get('/api/sync/pull')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.habits).toHaveLength(1);
    expect(response.body.habits[0].deletedAt).toBe(deletedAt);
  });
});
