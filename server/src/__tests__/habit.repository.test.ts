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
        deletedAt: null,
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
        deletedAt: null,
      }),
      repository.createOperation({
        id: 'habit-2',
        userId: user.id,
        title: 'Write',
        completedDates: '[]',
        updatedAt: new Date(),
        deletedAt: null,
      }),
    ]);

    const habits = await repository.findByIdsAndUserId(user.id, ['habit-2']);
    expect(habits).toHaveLength(1);
    expect(habits[0].id).toBe('habit-2');
  });

  it('does not return habits owned by another user', async () => {
    const firstUser = await prisma.user.create({
      data: {
        username: 'habit-first-owner',
        password: 'hashed-password',
      },
    });
    const secondUser = await prisma.user.create({
      data: {
        username: 'habit-second-owner',
        password: 'hashed-password',
      },
    });

    await repository.transaction([
      repository.createOperation({
        id: 'shared-id',
        userId: firstUser.id,
        title: 'Read',
        completedDates: '[]',
        updatedAt: new Date(),
        deletedAt: null,
      }),
    ]);

    const habits = await repository.findByIdsAndUserId(secondUser.id, ['shared-id']);

    expect(habits).toHaveLength(0);
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
        deletedAt: null,
      }),
    ]);

    await repository.transaction([
      repository.updateOperation('habit-1', {
        title: 'Read more',
        completedDates: '["2026-04-20"]',
        updatedAt: new Date('2026-04-20T10:00:00.000Z'),
        deletedAt: null,
      }),
    ]);

    const habits = await repository.findByUserId(user.id);
    expect(habits[0].title).toBe('Read more');
    expect(habits[0].completedDates).toBe('["2026-04-20"]');
  });

  it('updates deletedAt for soft delete tombstones', async () => {
    const user = await prisma.user.create({
      data: {
        username: 'habit-delete-owner',
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
        deletedAt: null,
      }),
    ]);

    const deletedAt = new Date('2026-04-20T11:00:00.000Z');
    await repository.transaction([repository.updateOperation('habit-1', { deletedAt })]);

    const habits = await repository.findByUserId(user.id);
    expect(habits).toHaveLength(1);
    expect(habits[0].deletedAt).toEqual(deletedAt);
  });
});
