import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Response } from 'express';
import { SyncController } from '../controllers/sync';
import { AuthRequest } from '../common/types/auth';
import { SyncService } from '../services/sync.service';

const createResponse = () => {
  return {
    json: vi.fn(),
  } as unknown as Response;
};

describe('SyncController', () => {
  const syncService = {
    pullHabits: vi.fn(),
    pushHabits: vi.fn(),
  } as unknown as SyncService;

  let controller: SyncController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new SyncController(syncService);
  });

  it('pushes habits through service', async () => {
    const request = {
      body: { habits: [{ id: '1', title: 'Read', completedDates: [] }] },
      userId: 'user-1',
    } as AuthRequest;
    const response = createResponse();

    vi.mocked(syncService.pushHabits).mockResolvedValue({
      success: true,
      message: 'ok',
    });

    await controller.pushHabits(request, response);

    expect(syncService.pushHabits).toHaveBeenCalledWith('user-1', request.body.habits);
    expect(response.json).toHaveBeenCalledWith({ success: true, message: 'ok' });
  });

  it('pulls habits through service', async () => {
    const request = {
      userId: 'user-1',
    } as AuthRequest;
    const response = createResponse();

    vi.mocked(syncService.pullHabits).mockResolvedValue([
      {
        id: '1',
        title: 'Read',
        completedDates: [],
        updatedAt: Date.now(),
        deletedAt: null,
      },
    ]);

    await controller.pullHabits(request, response);

    expect(syncService.pullHabits).toHaveBeenCalledWith('user-1');
    expect(response.json).toHaveBeenCalledWith({
      habits: [
        expect.objectContaining({
          id: '1',
          title: 'Read',
          completedDates: [],
          updatedAt: expect.any(Number),
        }),
      ],
    });
  });
});
