import { Router } from 'express';
import { register, login, getProfile, logout } from '../controllers/auth';
import { authMiddleware } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const authSchema = z.object({
  body: z.object({
    username: z.string().min(3),
    password: z.string().min(6)
  })
});

router.post('/register', validate(authSchema), register);
router.post('/login', validate(authSchema), login);
router.post('/logout', logout);
router.get('/me', authMiddleware, getProfile);

export default router;
