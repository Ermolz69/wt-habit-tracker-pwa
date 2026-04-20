import request from 'supertest';
import type { Express } from 'express';

let userSequence = 0;

export const resetTestDb = async () => {
  const { prisma } = await import('../infrastructure/prisma');
  await prisma.habit.deleteMany();
  await prisma.user.deleteMany();
};

export const createAuthToken = async (app: Express, usernamePrefix = 'test-user') => {
  userSequence += 1;
  const response = await request(app).post('/api/auth/register').send({
    username: `${usernamePrefix}-${userSequence}`,
    password: 'password123',
  });

  return response.body.token as string;
};

export const createHabitPayload = (overrides: Partial<{
  id: string;
  title: string;
  completedDates: string[];
  updatedAt: number;
  deletedAt: number | null;
}> = {}) => ({
  id: 'habit-1',
  title: 'Read',
  completedDates: [],
  updatedAt: Date.now(),
  ...overrides,
});
