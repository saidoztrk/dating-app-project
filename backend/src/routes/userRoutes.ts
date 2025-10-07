import { Router } from 'express';
import { getProfile, updateProfile, updateLocation, getUserById } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import { updateProfileValidator } from '../validators/userValidator';

const router = Router();

router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfileValidator, updateProfile);
router.patch('/location', authMiddleware, updateLocation);
router.get('/:userId', getUserById);

export default router;