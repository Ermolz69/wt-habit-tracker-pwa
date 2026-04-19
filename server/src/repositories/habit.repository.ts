import { PrismaClient, Habit } from '@prisma/client';

const prisma = new PrismaClient();

export class HabitRepository {
  async findByUserId(userId: string): Promise<Habit[]> {
    return prisma.habit.findMany({ where: { userId } });
  }

  async findByIdsAndUserId(userId: string, ids: string[]): Promise<Habit[]> {
    return prisma.habit.findMany({
      where: { userId, id: { in: ids } }
    });
  }

  async transaction(operations: any[]): Promise<any> {
    return prisma.$transaction(operations);
  }

  createOperation(data: Omit<Habit, 'createdAt'>) {
    return prisma.habit.create({ data });
  }

  updateOperation(id: string, data: Partial<Habit>) {
    return prisma.habit.update({ where: { id }, data });
  }
}

export const habitRepository = new HabitRepository();
