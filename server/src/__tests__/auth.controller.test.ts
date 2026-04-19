import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Response } from 'express';
import { AuthController } from '../controllers/auth';
import { AuthRequest } from '../common/types/auth';
import { AuthService } from '../services/auth.service';

const createResponse = () => {
  const response = {
    cookie: vi.fn(),
    clearCookie: vi.fn(),
    json: vi.fn(),
    status: vi.fn(),
  } as unknown as Response;

  vi.mocked(response.status).mockReturnValue(response);
  return response;
};

describe('AuthController', () => {
  const authService = {
    getProfile: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
  } as unknown as AuthService;

  let controller: AuthController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new AuthController(authService);
  });

  it('registers user and sets cookie', async () => {
    const request = {
      body: { username: 'john', password: 'password123' },
    } as AuthRequest;
    const response = createResponse();

    vi.mocked(authService.register).mockResolvedValue({
      user: { id: '1', username: 'john' },
      token: 'token-value',
    });

    await controller.register(request, response);

    expect(authService.register).toHaveBeenCalledWith('john', 'password123');
    expect(response.cookie).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith({
      user: { id: '1', username: 'john' },
      token: 'token-value',
    });
  });

  it('logs in user and returns payload', async () => {
    const request = {
      body: { username: 'john', password: 'password123' },
    } as AuthRequest;
    const response = createResponse();

    vi.mocked(authService.login).mockResolvedValue({
      user: { id: '1', username: 'john' },
      token: 'token-value',
    });

    await controller.login(request, response);

    expect(response.cookie).toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith({
      user: { id: '1', username: 'john' },
      token: 'token-value',
    });
  });

  it('clears cookie on logout', async () => {
    const response = createResponse();

    await controller.logout({} as AuthRequest, response);

    expect(response.clearCookie).toHaveBeenCalledWith('token');
    expect(response.json).toHaveBeenCalledWith({ success: true });
  });

  it('returns user profile', async () => {
    const request = {
      userId: 'user-1',
    } as AuthRequest;
    const response = createResponse();

    vi.mocked(authService.getProfile).mockResolvedValue({
      id: 'user-1',
      username: 'john',
      createdAt: new Date(),
    });

    await controller.getProfile(request, response);

    expect(authService.getProfile).toHaveBeenCalledWith('user-1');
    expect(response.json).toHaveBeenCalled();
  });
});
