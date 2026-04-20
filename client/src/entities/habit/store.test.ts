import { act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('localforage', () => ({
  default: {
    getItem: vi.fn().mockResolvedValue(null),
    removeItem: vi.fn().mockResolvedValue(undefined),
    setItem: vi.fn().mockResolvedValue(undefined),
  },
}));

import { useHabitStore } from './store';

describe('habit store', () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, 'crypto', {
      configurable: true,
      value: {
        ...globalThis.crypto,
        randomUUID: vi.fn(() => 'habit-1'),
      },
    });
    useHabitStore.setState({
      habits: [],
      isLoaded: true,
      lastSyncedAt: null,
      hasPendingChanges: false,
      syncError: null,
    });
  });

  it('marks local creation as pending sync', () => {
    act(() => {
      useHabitStore.getState().addHabit('Read');
    });

    expect(useHabitStore.getState().habits[0]).toMatchObject({
      id: 'habit-1',
      title: 'Read',
      deletedAt: null,
    });
    expect(useHabitStore.getState().hasPendingChanges).toBe(true);
  });

  it('soft deletes habits instead of removing them', () => {
    act(() => {
      useHabitStore.setState({
        habits: [{ id: 'habit-1', title: 'Read', completedDates: [], updatedAt: 1, deletedAt: null }],
        hasPendingChanges: false,
      });
      useHabitStore.getState().deleteHabit('habit-1');
    });

    const habit = useHabitStore.getState().habits[0];
    expect(habit.id).toBe('habit-1');
    expect(habit.deletedAt).toEqual(expect.any(Number));
    expect(useHabitStore.getState().hasPendingChanges).toBe(true);
  });

  it('stores sync success metadata', () => {
    act(() => {
      useHabitStore.setState({ hasPendingChanges: true, syncError: 'failed' });
      useHabitStore.getState().markSynced();
    });

    expect(useHabitStore.getState().hasPendingChanges).toBe(false);
    expect(useHabitStore.getState().syncError).toBeNull();
    expect(useHabitStore.getState().lastSyncedAt).toEqual(expect.any(Number));
  });

  it('clears synced tombstones after successful sync', () => {
    act(() => {
      useHabitStore.setState({
        habits: [
          { id: 'active', title: 'Read', completedDates: [], updatedAt: 1, deletedAt: null },
          { id: 'deleted', title: 'Write', completedDates: [], updatedAt: 2, deletedAt: 2 },
        ],
      });
      useHabitStore.getState().clearSyncedDeletedHabits();
    });

    expect(useHabitStore.getState().habits).toEqual([
      expect.objectContaining({ id: 'active' }),
    ]);
  });
});
