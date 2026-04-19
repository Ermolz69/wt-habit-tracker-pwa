import { Router } from 'express';
import { register, login, getProfile } from '../controllers/auth';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { authSchema } from '../validations';

const router = Router();

router.post('/register', validate(authSchema), register);
router.post('/login', validate(authSchema), login);
router.get('/profile', authenticate, getProfile);

export default router;
