import { describe, expect, it, vi } from 'vitest';
import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../common/middleware/async-handler';

describe('asyncHandler', () => {
  it('passes rejected route errors to next', async () => {
    const error = new Error('boom');
    const next = vi.fn() as NextFunction;
    const handler = asyncHandler(async () => {
      throw error;
    });

    handler({} as Request, {} as Response, next);
    await vi.waitFor(() => expect(next).toHaveBeenCalledWith(error));
  });

  it('does not call next for resolved handlers', async () => {
    const next = vi.fn() as NextFunction;
    const handler = asyncHandler(async () => 'ok');

    handler({} as Request, {} as Response, next);
    await Promise.resolve();

    expect(next).not.toHaveBeenCalled();
  });
});
