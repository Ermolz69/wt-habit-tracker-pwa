import { habitRepository } from '../repositories/habit.repository';

export class SyncService {
  async pushHabits(userId: string, habits: any[]) {
    if (!Array.isArray(habits)) {
      throw new Error('Habits must be an array');
    }

    const incomingIds = habits.map((h: any) => h.id);
    const existingHabits = await habitRepository.findByIdsAndUserId(userId, incomingIds);
    const existingMap = new Map(existingHabits.map(h => [h.id, h]));

    const operations = [];
    
    for (const habit of habits) {
      const existing = existingMap.get(habit.id);
      const incomingDate = new Date(habit.updatedAt || Date.now());

      if (!existing) {
        operations.push(habitRepository.createOperation({
          id: habit.id,
          userId,
          title: habit.title,
          completedDates: JSON.stringify(habit.completedDates || []),
          updatedAt: incomingDate
        }));
      } else if (incomingDate > existing.updatedAt) {
        operations.push(habitRepository.updateOperation(habit.id, {
          title: habit.title,
          completedDates: JSON.stringify(habit.completedDates || []),
          updatedAt: incomingDate
        }));
      }
    }

    if (operations.length > 0) {
      await habitRepository.transaction(operations);
    }
    
    return { success: true, message: 'Habits synced to server successfully' };
  }

  async pullHabits(userId: string) {
    const habits = await habitRepository.findByUserId(userId);
    
    // Parse completedDates back to array and updatedAt to timestamp
    const formattedHabits = habits.map(h => ({
      ...h,
      completedDates: JSON.parse(h.completedDates),
      updatedAt: h.updatedAt.getTime()
    }));

    return formattedHabits;
  }
}

export const syncService = new SyncService();
