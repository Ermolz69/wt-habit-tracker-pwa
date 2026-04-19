import { z } from 'zod';

export const authSchema = z.object({
  body: z.object({
    username: z.string().min(3, 'Username must be at least 3 characters').max(50),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const syncHabitsSchema = z.object({
  body: z.object({
    habits: z.array(
      z.object({
        id: z.string(),
        title: z.string().min(1, 'Title is required'),
        completedDates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')),
        updatedAt: z.number().optional(),
      })
    ),
  }),
});
