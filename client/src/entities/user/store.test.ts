import { beforeEach, describe, expect, it } from 'vitest';
import { useAuthStore } from './store';

describe('auth store', () => {
  beforeEach(() => {
    localStorage.clear();
    useAuthStore.setState({ user: null, isChecking: true });
  });

  it('persists user to localStorage', () => {
    useAuthStore.getState().setUser({ id: 'user-1', username: 'demo' });

    expect(useAuthStore.getState().user).toEqual({ id: 'user-1', username: 'demo' });
    expect(localStorage.getItem('user')).toBe(JSON.stringify({ id: 'user-1', username: 'demo' }));
  });

  it('clears user on logout', () => {
    localStorage.setItem('user', JSON.stringify({ id: 'user-1', username: 'demo' }));
    useAuthStore.setState({ user: { id: 'user-1', username: 'demo' } });

    useAuthStore.getState().logout();

    expect(useAuthStore.getState().user).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('updates auth checking state', () => {
    useAuthStore.getState().setChecking(false);

    expect(useAuthStore.getState().isChecking).toBe(false);
  });
});
