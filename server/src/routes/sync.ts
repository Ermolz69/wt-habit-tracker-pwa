import { Router } from 'express';
import { pushHabits, pullHabits } from '../controllers/sync';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { syncHabitsSchema } from '../validations';

const router = Router();

router.post('/push', authenticate, validate(syncHabitsSchema), pushHabits);
router.get('/pull', authenticate, pullHabits);

export default router;
