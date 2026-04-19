import { Router } from 'express';
import { asyncHandler } from '../common/middleware/async-handler';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { authController } from '../modules/auth.module';
import { authSchema } from '../validations';

const router = Router();

router.post('/register', validate(authSchema), asyncHandler(authController.register));
router.post('/login', validate(authSchema), asyncHandler(authController.login));
router.post('/logout', asyncHandler(authController.logout));
router.get('/me', authMiddleware, asyncHandler(authController.getProfile));
router.get('/profile', authMiddleware, asyncHandler(authController.getProfile));

export default router;
