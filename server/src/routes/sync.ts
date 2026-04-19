import { Router } from 'express';
import { asyncHandler } from '../common/middleware/async-handler';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { syncController } from '../modules/sync.module';
import { syncHabitsSchema } from '../validations';

const router = Router();

router.post('/push', authMiddleware, validate(syncHabitsSchema), asyncHandler(syncController.pushHabits));
router.get('/pull', authMiddleware, asyncHandler(syncController.pullHabits));

export default router;
