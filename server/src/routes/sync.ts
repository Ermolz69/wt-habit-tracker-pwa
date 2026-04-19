import { Router } from 'express';
import { pushHabits, pullHabits } from '../controllers/sync';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const syncHabitsSchema = z.object({
  body: z.object({
    habits: z.array(z.object({
      id: z.string(),
      title: z.string(),
      completedDates: z.array(z.string()),
      updatedAt: z.number().optional()
    }))
  })
});

router.post('/push', authMiddleware, validate(syncHabitsSchema), pushHabits);
router.get('/pull', authMiddleware, pullHabits);

export default router;
