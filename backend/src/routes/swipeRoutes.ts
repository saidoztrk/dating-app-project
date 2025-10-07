import { Router } from 'express';
import { getPotentialMatches, swipe, getLikesReceived, rewindSwipe } from '../controllers/swipeController';
import { authMiddleware } from '../middleware/authMiddleware';
import { premiumMiddleware } from '../middleware/premiumMiddleware';


const router = Router();

router.get('/potential-matches', authMiddleware, getPotentialMatches);
router.post('/swipe', authMiddleware, swipe);
router.get('/likes-received', authMiddleware, getLikesReceived);
router.post('/rewind', authMiddleware, premiumMiddleware, rewindSwipe);


export default router;