// backend/src/routes/reportRoutes.ts
import { Router } from 'express';
import { createReport } from '../controllers/reportController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createReport);

export default router;