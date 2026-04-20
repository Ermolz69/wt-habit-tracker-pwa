import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/entities/user';
import { useHabitStore } from '@/entities/habit';

const { fetchWithAuthMock } = vi.hoisted(() => ({
  fetchWithAuthMock: vi.fn(),
}));

vi.mock('@/shared/api', () => ({
  fetchWithAuth: fetchWithAuthMock,
}));

vi.mock('localforage', () => ({
  default: {
    getItem: vi.fn().mockResolvedValue(null),
    removeItem: vi.fn().mockResolvedValue(undefined),
    setItem: vi.fn().mockResolvedValue(undefined),
  },
}));

import { useSync } from './useSync';

const setOnlineStatus = (value: boolean) => {
  Object.defineProperty(navigator, 'onLine', {
    configurable: true,
    value,
  });
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useSync', () => {
  beforeEach(() => {
    fetchWithAuthMock.mockReset();
    setOnlineStatus(true);
    useAuthStore.setState({ user: { id: 'user-1', username: 'demo' }, isChecking: false });
    useHabitStore.setState({
      habits: [
        { id: 'habit-1', title: 'Read', completedDates: [], updatedAt: 1, deletedAt: null },
      ],
      isLoaded: true,
      hasPendingChanges: true,
      lastSyncedAt: null,
      syncError: null,
    });
  });

  it('pushes habits and marks state as synced', async () => {
    fetchWithAuthMock.mockResolvedValue({ success: true, message: 'ok' });
    const { result } = renderHook(() => useSync(), { wrapper: createWrapper() });

    act(() => {
      result.current.pushHabits();
    });

    await waitFor(() => expect(fetchWithAuthMock).toHaveBeenCalledWith('/sync/push', {
      method: 'POST',
      body: JSON.stringify({ habits: useHabitStore.getState().habits }),
    }));
    await waitFor(() => expect(useHabitStore.getState().hasPendingChanges).toBe(false));
    expect(useHabitStore.getState().lastSyncedAt).toEqual(expect.any(Number));
  });

  it('does not send push requests while offline', async () => {
    setOnlineStatus(false);
    const { result } = renderHook(() => useSync(), { wrapper: createWrapper() });

    act(() => {
      result.current.pushHabits();
    });

    await waitFor(() => expect(result.current.isPushing).toBe(false));
    expect(useHabitStore.getState().hasPendingChanges).toBe(true);
    expect(fetchWithAuthMock).not.toHaveBeenCalled();
  });

  it('syncNow pushes, pulls and cleans synced tombstones', async () => {
    useHabitStore.setState({
      habits: [
        { id: 'active', title: 'Read', completedDates: [], updatedAt: 1, deletedAt: null },
        { id: 'deleted', title: 'Write', completedDates: [], updatedAt: 2, deletedAt: 2 },
      ],
      hasPendingChanges: true,
    });
    fetchWithAuthMock
      .mockResolvedValueOnce({ success: true, message: 'ok' })
      .mockResolvedValueOnce({
        habits: [
          { id: 'active', title: 'Read', completedDates: [], updatedAt: 3, deletedAt: null },
          { id: 'deleted', title: 'Write', completedDates: [], updatedAt: 2, deletedAt: 2 },
        ],
      });
    const { result } = renderHook(() => useSync(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.syncNow();
    });

    expect(fetchWithAuthMock).toHaveBeenNthCalledWith(1, '/sync/push', expect.any(Object));
    expect(fetchWithAuthMock).toHaveBeenNthCalledWith(2, '/sync/pull');
    expect(useHabitStore.getState().habits).toEqual([
      expect.objectContaining({ id: 'active' }),
    ]);
  });

  it('syncNow stores a friendly error while offline', async () => {
    setOnlineStatus(false);
    const { result } = renderHook(() => useSync(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.syncNow();
    });

    expect(fetchWithAuthMock).not.toHaveBeenCalled();
    expect(useHabitStore.getState().syncError).toContain('You are offline');
  });
});
