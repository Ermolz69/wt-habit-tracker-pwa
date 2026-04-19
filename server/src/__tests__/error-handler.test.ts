import { describe, expect, it, vi } from 'vitest';
import { Response } from 'express';
import { z } from 'zod';
import { AppError } from '../common/errors/app-error';
import { errorHandler } from '../common/middleware/error-handler';

const createResponse = () => {
  const response = {
    json: vi.fn(),
    status: vi.fn(),
  } as unknown as Response;

  vi.mocked(response.status).mockReturnValue(response);
  return response;
};

describe('errorHandler', () => {
  it('handles AppError', () => {
    const response = createResponse();

    errorHandler(new AppError('Unauthorized', 401), {} as never, response, {} as never);

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({ error: 'Unauthorized', details: undefined });
  });

  it('handles ZodError', () => {
    const response = createResponse();
    const zodError = z.object({ name: z.string() }).safeParse({}).error!;

    errorHandler(zodError, {} as never, response, {} as never);

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      error: 'Validation failed',
      details: zodError.issues,
    });
  });

  it('handles unknown errors', () => {
    const response = createResponse();

    errorHandler(new Error('boom'), {} as never, response, {} as never);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });
});
