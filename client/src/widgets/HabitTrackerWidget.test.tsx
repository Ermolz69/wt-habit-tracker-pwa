import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useHabitStore } from '@/entities/habit';
import { HabitTrackerWidget } from './HabitTrackerWidget';

const pushHabitsMock = vi.fn();

vi.mock('localforage', () => ({
  default: {
    getItem: vi.fn().mockResolvedValue(null),
    removeItem: vi.fn().mockResolvedValue(undefined),
    setItem: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('@/features/sync-data', () => ({
  useSync: () => ({
    pushHabits: pushHabitsMock,
  }),
}));

const setOnlineStatus = (value: boolean) => {
  Object.defineProperty(navigator, 'onLine', {
    configurable: true,
    value,
  });
};

describe('HabitTrackerWidget', () => {
  beforeEach(() => {
    pushHabitsMock.mockReset();
    setOnlineStatus(true);
    useHabitStore.setState({
      habits: [],
      isLoaded: true,
      hasPendingChanges: false,
      lastSyncedAt: null,
      syncError: null,
    });
  });

  it('renders loading skeleton before store rehydration', () => {
    useHabitStore.setState({ isLoaded: false });

    const { container } = render(<HabitTrackerWidget />);

    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(3);
  });

  it('adds a habit through the form', () => {
    render(<HabitTrackerWidget />);

    fireEvent.change(screen.getByLabelText('New habit name'), { target: { value: 'Read daily' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add habit' }));

    expect(screen.getByText('Read daily')).toBeInTheDocument();
    expect(useHabitStore.getState().hasPendingChanges).toBe(true);
  });

  it('opens delete dialog and soft deletes confirmed habit', () => {
    useHabitStore.setState({
      habits: [{ id: 'habit-1', title: 'Read', completedDates: [], updatedAt: 1, deletedAt: null }],
    });
    render(<HabitTrackerWidget />);

    fireEvent.click(screen.getByRole('button', { name: 'Delete habit' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(screen.queryByText('Read')).not.toBeInTheDocument();
    expect(useHabitStore.getState().habits[0].deletedAt).toEqual(expect.any(Number));
  });

  it('auto-syncs pending changes only while online', async () => {
    useHabitStore.setState({
      habits: [{ id: 'habit-1', title: 'Read', completedDates: [], updatedAt: 1, deletedAt: null }],
      hasPendingChanges: true,
    });

    render(<HabitTrackerWidget />);

    await waitFor(() => expect(pushHabitsMock).toHaveBeenCalledTimes(1));
  });

  it('shows offline helper and skips auto-sync while offline', () => {
    setOnlineStatus(false);
    useHabitStore.setState({
      habits: [{ id: 'habit-1', title: 'Read', completedDates: [], updatedAt: 1, deletedAt: null }],
      hasPendingChanges: true,
    });

    render(<HabitTrackerWidget />);

    expect(screen.getByText(/Offline mode is active/)).toBeInTheDocument();
    expect(pushHabitsMock).not.toHaveBeenCalled();
  });
});
