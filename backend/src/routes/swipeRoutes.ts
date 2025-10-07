import { Router } from 'express';
import { getPotentialMatches, swipe, getLikesReceived } from '../controllers/swipeController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/potential-matches', authMiddleware, getPotentialMatches);
router.post('/swipe', authMiddleware, swipe);
router.get('/likes-received', authMiddleware, getLikesReceived);


export default router;