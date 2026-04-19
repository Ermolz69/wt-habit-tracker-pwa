import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const pushHabits = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { habits } = req.body; // Expects array of { id, title, completedDates }

    if (!Array.isArray(habits)) {
      res.status(400).json({ error: 'Habits must be an array' });
      return;
    }

    // Since SQLite with Prisma doesn't support createMany with update (upsert many),
    // we'll use a transaction with multiple upserts
    const upserts = habits.map((habit: any) => {
      return prisma.habit.upsert({
        where: { id: habit.id },
        update: {
          title: habit.title,
          completedDates: JSON.stringify(habit.completedDates || []),
          updatedAt: new Date()
        },
        create: {
          id: habit.id,
          userId,
          title: habit.title,
          completedDates: JSON.stringify(habit.completedDates || []),
        }
      });
    });

    await prisma.$transaction(upserts);

    res.json({ success: true, message: 'Habits synced to server successfully' });
  } catch (error) {
    console.error('Sync push error:', error);
    res.status(500).json({ error: 'Server error during sync push' });
  }
};

export const pullHabits = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    
    const habits = await prisma.habit.findMany({
      where: { userId }
    });

    // Parse completedDates back to array
    const formattedHabits = habits.map(h => ({
      ...h,
      completedDates: JSON.parse(h.completedDates)
    }));

    res.json({ habits: formattedHabits });
  } catch (error) {
    console.error('Sync pull error:', error);
    res.status(500).json({ error: 'Server error during sync pull' });
  }
};
