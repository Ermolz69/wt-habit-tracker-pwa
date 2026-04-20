import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiRequest, fetchWithAuth } from './index';

describe('shared api client', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('sends JSON requests with credentials included', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ success: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiRequest('/health', { method: 'POST', body: '{"ok":true}' })).resolves.toEqual({
      success: true,
    });

    expect(fetchMock).toHaveBeenCalledWith('http://localhost:3000/api/health', {
      method: 'POST',
      body: '{"ok":true}',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
  });

  it('preserves custom headers', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ ok: true }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await apiRequest('/custom', {
      headers: {
        Authorization: 'Bearer token',
      },
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token',
        },
      })
    );
  });

  it('throws backend error messages for failed responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: 'Invalid credentials' }),
    }));

    await expect(apiRequest('/auth/login')).rejects.toThrow('Invalid credentials');
  });

  it('throws a fallback error when failed response has no JSON body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockRejectedValue(new Error('bad json')),
    }));

    await expect(fetchWithAuth('/broken')).rejects.toThrow('API Request Failed');
  });
});
