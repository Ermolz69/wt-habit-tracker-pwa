import { describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { AppError } from '../common/errors/app-error';
import { AuthRequest } from '../common/types/auth';
import { authMiddleware } from '../middleware/auth';

describe('authMiddleware', () => {
  it('accepts bearer token', () => {
    const token = jwt.sign(
      { userId: 'user-1' },
      process.env.JWT_SECRET || 'super-secret-key-123'
    );
    const request = {
      cookies: {},
      header: vi.fn().mockReturnValue(`Bearer ${token}`),
    } as unknown as AuthRequest;
    const next = vi.fn() as NextFunction;

    authMiddleware(request, {} as Response, next);

    expect(request.userId).toBe('user-1');
    expect(next).toHaveBeenCalledWith();
  });

  it('accepts cookie token', () => {
    const token = jwt.sign(
      { userId: 'user-1' },
      process.env.JWT_SECRET || 'super-secret-key-123'
    );
    const request = {
      cookies: { token },
      header: vi.fn(),
    } as unknown as AuthRequest;
    const next = vi.fn() as NextFunction;

    authMiddleware(request, {} as Response, next);

    expect(request.userId).toBe('user-1');
    expect(next).toHaveBeenCalledWith();
  });

  it('rejects missing token', () => {
    const request = {
      cookies: {},
      header: vi.fn().mockReturnValue(undefined),
    } as unknown as AuthRequest;
    const next = vi.fn() as NextFunction;

    authMiddleware(request, {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });

  it('rejects invalid token', () => {
    const request = {
      cookies: {},
      header: vi.fn().mockReturnValue('Bearer invalid'),
    } as unknown as AuthRequest;
    const next = vi.fn() as NextFunction;

    authMiddleware(request, {} as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });
});
