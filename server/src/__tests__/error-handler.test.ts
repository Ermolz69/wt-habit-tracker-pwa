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

  it('passes AppError details to response', () => {
    const response = createResponse();
    const details = [{ field: 'username', message: 'Required' }];

    errorHandler(new AppError('Invalid input', 422, details), {} as never, response, {} as never);

    expect(response.status).toHaveBeenCalledWith(422);
    expect(response.json).toHaveBeenCalledWith({ error: 'Invalid input', details });
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
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    errorHandler(new Error('boom'), {} as never, response, {} as never);

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    
    consoleSpy.mockRestore();
  });
});
