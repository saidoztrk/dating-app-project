import { Router } from 'express';
import { getMessages, sendMessage } from '../controllers/messageController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.get('/:matchId', authMiddleware, getMessages);
router.post('/:matchId', authMiddleware, sendMessage);

export default router;