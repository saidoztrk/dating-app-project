import { Router } from 'express';
import { getPlans, subscribe, getSubscriptionStatus } from '../controllers/subscriptionController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/plans', getPlans);
router.post('/subscribe', authMiddleware, subscribe);
router.get('/status', authMiddleware, getSubscriptionStatus);

export default router;