import { describe, expect, it } from 'vitest';
import { HabitRepository } from '../repositories/habit.repository';
import { prisma } from '../infrastructure/prisma';

describe('HabitRepository', () => {
  const repository = new HabitRepository(prisma);

  it('creates habits through transaction', async () => {
    const user = await prisma.user.create({
      data: {
        username: 'habit-owner',
        password: 'hashed-password',
      },
    });

    await repository.transaction([
      repository.createOperation({
        id: 'habit-1',
        userId: user.id,
        title: 'Read',
        completedDates: '[]',
        updatedAt: new Date(),
      }),
    ]);

    const habits = await repository.findByUserId(user.id);
    expect(habits).toHaveLength(1);
  });

  it('finds habits by ids and user id', async () => {
    const user = await prisma.user.create({
      data: {
        username: 'habit-filter-owner',
        password: 'hashed-password',
      },
    });

    await repository.transaction([
      repository.createOperation({
        id: 'habit-1',
        userId: user.id,
        title: 'Read',
        completedDates: '[]',
        updatedAt: new Date(),
      }),
      repository.createOperation({
        id: 'habit-2',
        userId: user.id,
        title: 'Write',
        completedDates: '[]',
        updatedAt: new Date(),
      }),
    ]);

    const habits = await repository.findByIdsAndUserId(user.id, ['habit-2']);
    expect(habits).toHaveLength(1);
    expect(habits[0].id).toBe('habit-2');
  });

  it('updates existing habits', async () => {
    const user = await prisma.user.create({
      data: {
        username: 'habit-update-owner',
        password: 'hashed-password',
      },
    });

    await repository.transaction([
      repository.createOperation({
        id: 'habit-1',
        userId: user.id,
        title: 'Read',
        completedDates: '[]',
        updatedAt: new Date('2026-04-20T09:00:00.000Z'),
      }),
    ]);

    await repository.transaction([
      repository.updateOperation('habit-1', {
        title: 'Read more',
        completedDates: '["2026-04-20"]',
        updatedAt: new Date('2026-04-20T10:00:00.000Z'),
      }),
    ]);

    const habits = await repository.findByUserId(user.id);
    expect(habits[0].title).toBe('Read more');
    expect(habits[0].completedDates).toBe('["2026-04-20"]');
  });
});
