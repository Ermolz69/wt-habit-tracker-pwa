import { Habit, Prisma } from '@prisma/client';
import { HabitDto, HabitSyncPayload } from '../types/habit';

export const toHabitDto = (habit: Habit): HabitDto => ({
  id: habit.id,
  title: habit.title,
  completedDates: JSON.parse(habit.completedDates) as string[],
  updatedAt: habit.updatedAt.getTime(),
  deletedAt: habit.deletedAt?.getTime() ?? null,
});

export const toHabitCreateInput = (
  userId: string,
  habit: HabitSyncPayload
): Prisma.HabitUncheckedCreateInput => ({
  id: habit.id,
  userId,
  title: habit.title,
  completedDates: JSON.stringify(habit.completedDates || []),
  updatedAt: new Date(habit.updatedAt || Date.now()),
  deletedAt: habit.deletedAt ? new Date(habit.deletedAt) : null,
});

export const toHabitUpdateInput = (
  habit: HabitSyncPayload
): Prisma.HabitUncheckedUpdateInput => ({
  title: habit.title,
  completedDates: JSON.stringify(habit.completedDates || []),
  updatedAt: new Date(habit.updatedAt || Date.now()),
  deletedAt: habit.deletedAt ? new Date(habit.deletedAt) : null,
});
