import { describe, expect, it } from 'vitest';
import { Habit } from '@prisma/client';
import { toHabitCreateInput, toHabitDto, toHabitUpdateInput } from '../mappers/habit.mapper';

describe('habit mapper', () => {
  it('maps Prisma habits to API DTOs', () => {
    const deletedAt = new Date('2026-04-20T10:05:00.000Z');
    const habit = {
      id: 'habit-1',
      userId: 'user-1',
      title: 'Read',
      completedDates: '["2026-04-20"]',
      createdAt: new Date('2026-04-20T10:00:00.000Z'),
      updatedAt: new Date('2026-04-20T10:01:00.000Z'),
      deletedAt,
    } satisfies Habit;

    expect(toHabitDto(habit)).toEqual({
      id: 'habit-1',
      title: 'Read',
      completedDates: ['2026-04-20'],
      updatedAt: new Date('2026-04-20T10:01:00.000Z').getTime(),
      deletedAt: deletedAt.getTime(),
    });
  });

  it('maps active Prisma habits with null deletedAt', () => {
    const habit = {
      id: 'habit-1',
      userId: 'user-1',
      title: 'Read',
      completedDates: '[]',
      createdAt: new Date('2026-04-20T10:00:00.000Z'),
      updatedAt: new Date('2026-04-20T10:01:00.000Z'),
      deletedAt: null,
    } satisfies Habit;

    expect(toHabitDto(habit)).toEqual(expect.objectContaining({
      completedDates: [],
      deletedAt: null,
    }));
  });

  it('uses current time defaults for payloads without updatedAt', () => {
    const before = Date.now();
    const input = toHabitCreateInput('user-1', {
      id: 'habit-1',
      title: 'Read',
      completedDates: [],
    });
    const after = Date.now();

    expect(input.updatedAt).toBeInstanceOf(Date);
    expect((input.updatedAt as Date).getTime()).toBeGreaterThanOrEqual(before);
    expect((input.updatedAt as Date).getTime()).toBeLessThanOrEqual(after);
  });

  it('maps sync payloads to persistence create input', () => {
    expect(toHabitCreateInput('user-1', {
      id: 'habit-1',
      title: 'Read',
      completedDates: ['2026-04-20'],
      updatedAt: 1776679200000,
      deletedAt: null,
    })).toEqual({
      id: 'habit-1',
      userId: 'user-1',
      title: 'Read',
      completedDates: '["2026-04-20"]',
      updatedAt: new Date(1776679200000),
      deletedAt: null,
    });
  });

  it('maps sync payloads to persistence update input', () => {
    expect(toHabitUpdateInput({
      id: 'habit-1',
      title: 'Read more',
      completedDates: [],
      updatedAt: 1776679200000,
      deletedAt: 1776679300000,
    })).toEqual({
      title: 'Read more',
      completedDates: '[]',
      updatedAt: new Date(1776679200000),
      deletedAt: new Date(1776679300000),
    });
  });
});
