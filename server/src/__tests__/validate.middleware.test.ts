import { describe, expect, it, vi } from 'vitest';
import { z, ZodError } from 'zod';
import { NextFunction, Request, Response } from 'express';
import { validate } from '../middleware/validate';

describe('validate middleware', () => {
  const schema = z.object({
    body: z.object({
      username: z.string().min(3),
    }),
  });

  it('passes valid request to next', async () => {
    const middleware = validate(schema);
    const next = vi.fn() as NextFunction;

    await middleware(
      { body: { username: 'john' }, params: {}, query: {} } as Request,
      {} as Response,
      next
    );

    expect(next).toHaveBeenCalledWith();
  });

  it('passes zod error to next for invalid request', async () => {
    const middleware = validate(schema);
    const next = vi.fn() as NextFunction;

    await middleware(
      { body: { username: 'ab' }, params: {}, query: {} } as Request,
      {} as Response,
      next
    );

    expect(next).toHaveBeenCalledWith(expect.any(ZodError));
  });
});
