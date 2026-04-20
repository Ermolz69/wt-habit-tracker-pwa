import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useHabitStore } from '@/entities/habit';
import { AchievementsBoard } from './AchievementsBoard';

vi.mock('localforage', () => ({
  default: {
    getItem: vi.fn().mockResolvedValue(null),
    removeItem: vi.fn().mockResolvedValue(undefined),
    setItem: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('AchievementsBoard', () => {
  beforeEach(() => {
    useHabitStore.setState({
      habits: [],
      isLoaded: true,
      hasPendingChanges: false,
      lastSyncedAt: null,
      syncError: null,
    });
  });

  it('shows empty state without visible habits', () => {
    render(<AchievementsBoard />);

    expect(screen.getByText('No achievements yet. Keep tracking your habits!')).toBeInTheDocument();
  });

  it('unlocks achievements from visible habits only', () => {
    useHabitStore.setState({
      habits: [
        { id: '1', title: 'Read', completedDates: ['2026-04-15', '2026-04-16', '2026-04-17', '2026-04-18', '2026-04-19', '2026-04-20', '2026-04-21'], updatedAt: 1, deletedAt: null },
        { id: '2', title: 'Write', completedDates: ['2026-04-20'], updatedAt: 1, deletedAt: null },
        { id: '3', title: 'Run', completedDates: ['2026-04-20'], updatedAt: 1, deletedAt: null },
        { id: '4', title: 'Deleted', completedDates: ['2026-04-20'], updatedAt: 1, deletedAt: 2 },
      ],
    });

    render(<AchievementsBoard />);

    expect(screen.getByText('First Blood')).toBeInTheDocument();
    expect(screen.getByText('Consistency')).toBeInTheDocument();
    expect(screen.getByText('Champion')).toBeInTheDocument();
    expect(screen.getByText('Multi-Focus')).toBeInTheDocument();
    expect(screen.queryByText('Architect')).not.toBeInTheDocument();
  });
});
