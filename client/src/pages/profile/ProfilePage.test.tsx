import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/entities/user';
import { useHabitStore } from '@/entities/habit';
import { ProfilePage } from './ProfilePage';

const navigateMock = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}));

vi.mock('localforage', () => ({
  default: {
    getItem: vi.fn().mockResolvedValue(null),
    removeItem: vi.fn().mockResolvedValue(undefined),
    setItem: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    useAuthStore.setState({
      user: { id: 'user-1', username: 'demo', createdAt: '2026-04-20T00:00:00.000Z' },
      isChecking: false,
    });
    useHabitStore.setState({
      habits: [
        { id: '1', title: 'Read', completedDates: ['2026-04-20', '2026-04-21'], updatedAt: 1, deletedAt: null },
        { id: '2', title: 'Run', completedDates: [], updatedAt: 1, deletedAt: null },
        { id: '3', title: 'Deleted', completedDates: ['2026-04-20'], updatedAt: 1, deletedAt: 2 },
      ],
      isLoaded: true,
    });
  });

  it('renders account identity and stats excluding deleted habits', () => {
    render(<ProfilePage />);

    expect(screen.getByText('demo')).toBeInTheDocument();
    expect(screen.getByText('user-1')).toBeInTheDocument();
    expect(screen.getByText('April 20, 2026')).toBeInTheDocument();
    expect(screen.getByText('habits created').previousSibling).toHaveTextContent('2');
    expect(screen.getByText('active habits').previousSibling).toHaveTextContent('1');
    expect(screen.getByText('Total completed check-ins').nextSibling).toHaveTextContent('2');
  });

  it('navigates back to dashboard', () => {
    render(<ProfilePage />);

    fireEvent.click(screen.getByRole('button', { name: 'Back to dashboard' }));

    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('redirects to auth without user', () => {
    useAuthStore.setState({ user: null });

    render(<ProfilePage />);

    expect(navigateMock).toHaveBeenCalledWith('/auth');
  });
});
