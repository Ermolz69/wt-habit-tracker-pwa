import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError } from '../common/errors/app-error';
import { HabitRepository } from '../repositories/habit.repository';
import { SyncService } from '../services/sync.service';

describe('SyncService', () => {
  const habitRepository = {
    createOperation: vi.fn(),
    findByIdsAndUserId: vi.fn(),
    findByUserId: vi.fn(),
    transaction: vi.fn(),
    updateOperation: vi.fn(),
  } as unknown as HabitRepository;

  let service: SyncService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new SyncService(habitRepository);
  });

  it('creates new habits during push', async () => {
    vi.mocked(habitRepository.findByIdsAndUserId).mockResolvedValue([]);
    vi.mocked(habitRepository.createOperation).mockReturnValue('create-op' as never);

    await service.pushHabits('user-1', [
      { id: 'habit-1', title: 'Read', completedDates: ['2026-04-20'], updatedAt: Date.now() },
    ]);

    expect(habitRepository.createOperation).toHaveBeenCalled();
    expect(habitRepository.transaction).toHaveBeenCalledWith(['create-op']);
  });

  it('updates existing habits when incoming item is newer', async () => {
    vi.mocked(habitRepository.findByIdsAndUserId).mockResolvedValue([
      {
        id: 'habit-1',
        userId: 'user-1',
        title: 'Old',
        completedDates: '[]',
        createdAt: new Date(),
        updatedAt: new Date('2026-04-01T00:00:00.000Z'),
        deletedAt: null,
      },
    ]);
    vi.mocked(habitRepository.updateOperation).mockReturnValue('update-op' as never);

    await service.pushHabits('user-1', [
      { id: 'habit-1', title: 'New', completedDates: ['2026-04-20'], updatedAt: Date.now() },
    ]);

    expect(habitRepository.updateOperation).toHaveBeenCalled();
    expect(habitRepository.transaction).toHaveBeenCalledWith(['update-op']);
  });

  it('does not overwrite newer server habits with stale incoming data', async () => {
    vi.mocked(habitRepository.findByIdsAndUserId).mockResolvedValue([
      {
        id: 'habit-1',
        userId: 'user-1',
        title: 'Server newer',
        completedDates: '[]',
        createdAt: new Date(),
        updatedAt: new Date('2026-04-20T10:00:00.000Z'),
        deletedAt: null,
      },
    ]);

    await service.pushHabits('user-1', [
      {
        id: 'habit-1',
        title: 'Client stale',
        completedDates: ['2026-04-20'],
        updatedAt: new Date('2026-04-20T09:00:00.000Z').getTime(),
      },
    ]);

    expect(habitRepository.updateOperation).not.toHaveBeenCalled();
    expect(habitRepository.transaction).toHaveBeenCalledWith([]);
  });

  it('does not delete habits missing from incoming snapshot', async () => {
    vi.mocked(habitRepository.findByIdsAndUserId).mockResolvedValue([]);

    await service.pushHabits('user-1', []);

    expect(habitRepository.transaction).toHaveBeenCalledWith([]);
  });

  it('stores deletedAt tombstones during push', async () => {
    vi.mocked(habitRepository.findByIdsAndUserId).mockResolvedValue([]);
    vi.mocked(habitRepository.createOperation).mockReturnValue('create-tombstone-op' as never);

    await service.pushHabits('user-1', [
      {
        id: 'habit-1',
        title: 'Read',
        completedDates: [],
        updatedAt: new Date('2026-04-20T10:00:00.000Z').getTime(),
        deletedAt: new Date('2026-04-20T10:05:00.000Z').getTime(),
      },
    ]);

    expect(habitRepository.createOperation).toHaveBeenCalledWith(expect.objectContaining({
      deletedAt: new Date('2026-04-20T10:05:00.000Z'),
    }));
    expect(habitRepository.transaction).toHaveBeenCalledWith(['create-tombstone-op']);
  });

  it('rejects invalid habits payload', async () => {
    await expect(service.pushHabits('user-1', null as never)).rejects.toMatchObject({
      message: 'Habits must be an array',
      statusCode: 400,
    });
  });

  it('pulls and formats habits', async () => {
    vi.mocked(habitRepository.findByUserId).mockResolvedValue([
      {
        id: 'habit-1',
        userId: 'user-1',
        title: 'Read',
        completedDates: '["2026-04-20"]',
        createdAt: new Date(),
        updatedAt: new Date('2026-04-20T10:00:00.000Z'),
        deletedAt: new Date('2026-04-20T10:05:00.000Z'),
      },
    ]);

    await expect(service.pullHabits('user-1')).resolves.toEqual([
      expect.objectContaining({
        id: 'habit-1',
        title: 'Read',
        completedDates: ['2026-04-20'],
        updatedAt: new Date('2026-04-20T10:00:00.000Z').getTime(),
        deletedAt: new Date('2026-04-20T10:05:00.000Z').getTime(),
      }),
    ]);
  });
});
