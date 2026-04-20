import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/entities/user';
import { useHabitStore } from '@/entities/habit';
import { HomePage } from './HomePage';

const { fetchWithAuthMock, navigateMock, syncNowMock } = vi.hoisted(() => ({
  fetchWithAuthMock: vi.fn(),
  navigateMock: vi.fn(),
  syncNowMock: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: ReactNode; to: string }) => <a href={to}>{children}</a>,
  useNavigate: () => navigateMock,
}));

vi.mock('@/features/sync-data', () => ({
  useSync: () => ({
    isPulling: false,
    isPushing: false,
    syncNow: syncNowMock,
  }),
}));

vi.mock('@/shared/api', () => ({
  fetchWithAuth: fetchWithAuthMock,
}));

vi.mock('@/shared/lib', async () => {
  const actual = await vi.importActual<typeof import('@/shared/lib')>('@/shared/lib');
  return {
    ...actual,
    useNetworkStatus: () => true,
  };
});

vi.mock('localforage', () => ({
  default: {
    getItem: vi.fn().mockResolvedValue(null),
    removeItem: vi.fn().mockResolvedValue(undefined),
    setItem: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('HomePage', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    syncNowMock.mockReset();
    fetchWithAuthMock.mockReset();
    fetchWithAuthMock.mockResolvedValue({ success: true });
    useAuthStore.setState({
      user: { id: 'user-1', username: 'demo' },
      isChecking: false,
    });
    useHabitStore.setState({
      habits: [
        { id: '1', title: 'Read', completedDates: [new Date().toISOString().slice(0, 10)], updatedAt: 1, deletedAt: null },
        { id: '2', title: 'Deleted', completedDates: [new Date().toISOString().slice(0, 10)], updatedAt: 1, deletedAt: 2 },
      ],
      isLoaded: true,
      hasPendingChanges: false,
      lastSyncedAt: null,
      syncError: null,
    });
  });

  it('renders dashboard stats excluding deleted habits', () => {
    render(<HomePage />);

    expect(screen.getByText('Keep your momentum steady, visible and satisfying.')).toBeInTheDocument();
    expect(screen.getByText('habits').previousSibling).toHaveTextContent('1');
    expect(screen.getByText('today').previousSibling).toHaveTextContent('1');
    expect(screen.getByText('check-ins').previousSibling).toHaveTextContent('1');
  });

  it('logs out and redirects to auth', async () => {
    render(<HomePage />);

    fireEvent.click(screen.getByRole('button', { name: 'Logout' }));

    await waitFor(() => expect(fetchWithAuthMock).toHaveBeenCalledWith('/auth/logout', { method: 'POST' }));
    expect(useAuthStore.getState().user).toBeNull();
    expect(navigateMock).toHaveBeenCalledWith('/auth');
  });

  it('redirects to auth without a user', () => {
    useAuthStore.setState({ user: null });

    render(<HomePage />);

    expect(navigateMock).toHaveBeenCalledWith('/auth');
  });
});
