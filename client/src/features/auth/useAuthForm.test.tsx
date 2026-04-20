import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuthStore } from '@/entities/user';

const { loginUserMock, navigateMock, registerUserMock } = vi.hoisted(() => ({
  loginUserMock: vi.fn(),
  navigateMock: vi.fn(),
  registerUserMock: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('./api', () => ({
  loginUser: loginUserMock,
  registerUser: registerUserMock,
}));

import { useAuthForm } from './useAuthForm';

const wrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

const submitEvent = {
  preventDefault: vi.fn(),
} as unknown as React.FormEvent;

describe('useAuthForm', () => {
  beforeEach(() => {
    navigateMock.mockReset();
    loginUserMock.mockReset();
    registerUserMock.mockReset();
    submitEvent.preventDefault = vi.fn();
    useAuthStore.setState({ user: null, isChecking: false });
    localStorage.clear();
  });

  it('logs in and navigates to dashboard', async () => {
    loginUserMock.mockResolvedValue({ user: { id: '1', username: 'demo' }, token: 'token' });
    const { result } = renderHook(() => useAuthForm(), { wrapper });

    act(() => {
      result.current.setUsername('demo');
      result.current.setPassword('secret');
    });
    await act(async () => {
      await result.current.handleSubmit(submitEvent);
    });

    expect(loginUserMock).toHaveBeenCalledWith({ username: 'demo', password: 'secret' });
    expect(useAuthStore.getState().user).toEqual({ id: '1', username: 'demo' });
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('registers after toggling mode', async () => {
    registerUserMock.mockResolvedValue({ user: { id: '2', username: 'new-user' }, token: 'token' });
    const { result } = renderHook(() => useAuthForm(), { wrapper });

    act(() => {
      result.current.toggleMode();
      result.current.setUsername('new-user');
      result.current.setPassword('secret');
    });
    await act(async () => {
      await result.current.handleSubmit(submitEvent);
    });

    expect(registerUserMock).toHaveBeenCalledWith({ username: 'new-user', password: 'secret' });
    expect(navigateMock).toHaveBeenCalledWith('/');
  });

  it('stores submit errors and clears them on mode toggle', async () => {
    loginUserMock.mockRejectedValue(new Error('Invalid credentials'));
    const { result } = renderHook(() => useAuthForm(), { wrapper });

    await act(async () => {
      await result.current.handleSubmit(submitEvent);
    });
    expect(result.current.error).toBe('Invalid credentials');

    act(() => {
      result.current.toggleMode();
    });
    expect(result.current.error).toBe('');
  });
});
