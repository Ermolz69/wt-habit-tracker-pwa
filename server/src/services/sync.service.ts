import { Prisma } from '@prisma/client';
import { AppError } from '../common/errors/app-error';
import { toHabitCreateInput, toHabitDto, toHabitUpdateInput } from '../mappers/habit.mapper';
import { HabitRepository } from '../repositories/habit.repository';
import { HabitSyncPayload } from '../types/habit';

export class SyncService {
  constructor(private readonly habitRepository: HabitRepository) {}

  async pushHabits(userId: string, habits: HabitSyncPayload[]) {
    if (!Array.isArray(habits)) {
      throw new AppError('Habits must be an array', 400);
    }

    const incomingIds = habits.map((habit) => habit.id);
    const existingHabits = await this.habitRepository.findByIdsAndUserId(userId, incomingIds);
    const existingMap = new Map(existingHabits.map((habit) => [habit.id, habit]));

    const operations: Prisma.PrismaPromise<unknown>[] = [];
    
    for (const habit of habits) {
      const existing = existingMap.get(habit.id);
      const incomingDate = new Date(habit.updatedAt || Date.now());

      if (!existing) {
        operations.push(this.habitRepository.createOperation(toHabitCreateInput(userId, habit)));
      } else if (incomingDate > existing.updatedAt) {
        operations.push(this.habitRepository.updateOperation(habit.id, toHabitUpdateInput(habit)));
      }
    }

    await this.habitRepository.transaction(operations);
    
    return { success: true, message: 'Habits synced to server successfully' };
  }

  async pullHabits(userId: string) {
    const habits = await this.habitRepository.findByUserId(userId);

    return habits.map(toHabitDto);
  }
}
