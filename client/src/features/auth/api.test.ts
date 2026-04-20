import { beforeEach, describe, expect, it, vi } from 'vitest';

const { apiRequestMock } = vi.hoisted(() => ({
  apiRequestMock: vi.fn(),
}));

vi.mock('@/shared/api', () => ({
  apiRequest: apiRequestMock,
}));

import { loginUser, registerUser } from './api';

describe('auth api', () => {
  beforeEach(() => {
    apiRequestMock.mockReset();
  });

  it('sends login payload to auth endpoint', async () => {
    apiRequestMock.mockResolvedValue({ user: { id: '1', username: 'demo' }, token: 'token' });

    await loginUser({ username: 'demo', password: 'secret' });

    expect(apiRequestMock).toHaveBeenCalledWith('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username: 'demo', password: 'secret' }),
    });
  });

  it('sends register payload to auth endpoint', async () => {
    apiRequestMock.mockResolvedValue({ user: { id: '1', username: 'demo' }, token: 'token' });

    await registerUser({ username: 'demo', password: 'secret' });

    expect(apiRequestMock).toHaveBeenCalledWith('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username: 'demo', password: 'secret' }),
    });
  });
});
