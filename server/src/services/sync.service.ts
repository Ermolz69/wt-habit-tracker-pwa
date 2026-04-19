import { AppError } from '../common/errors/app-error';
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

    const operations = [];
    
    for (const habit of habits) {
      const existing = existingMap.get(habit.id);
      const incomingDate = new Date(habit.updatedAt || Date.now());

      if (!existing) {
        operations.push(this.habitRepository.createOperation({
          id: habit.id,
          userId,
          title: habit.title,
          completedDates: JSON.stringify(habit.completedDates || []),
          updatedAt: incomingDate,
        }));
      } else if (incomingDate > existing.updatedAt) {
        operations.push(this.habitRepository.updateOperation(habit.id, {
          title: habit.title,
          completedDates: JSON.stringify(habit.completedDates || []),
          updatedAt: incomingDate,
        }));
      }
    }

    if (operations.length > 0) {
      await this.habitRepository.transaction(operations);
    }
    
    return { success: true, message: 'Habits synced to server successfully' };
  }

  async pullHabits(userId: string) {
    const habits = await this.habitRepository.findByUserId(userId);
    
    const formattedHabits = habits.map((habit) => ({
      ...habit,
      completedDates: JSON.parse(habit.completedDates) as string[],
      updatedAt: habit.updatedAt.getTime(),
    }));

    return formattedHabits;
  }
}
