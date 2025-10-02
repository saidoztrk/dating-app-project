import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { registerValidator, loginValidator } from '../validators/authValidator';

const router = Router();

// POST /api/auth/register
router.post('/register', registerValidator, register);

// POST /api/auth/login
router.post('/login', loginValidator, login);

export default router;