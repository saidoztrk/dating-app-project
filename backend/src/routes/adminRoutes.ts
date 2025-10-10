// backend/src/routes/adminRoutes.ts
import { Router } from 'express';
import {
    adminLogin,
    getDashboardStats,
    getAllUsers,
    banUser,
    unbanUser,
    deleteUser,
    getReports,
    reviewReport,
    getAnalytics,  // ✅ YENİ
    generateHash
} from '../controllers/adminController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminMiddleware } from '../middleware/adminMiddleware';

const router = Router();

// Public routes
router.post('/login', adminLogin);
router.post('/generate-hash', generateHash);

// Protected admin routes
router.get('/dashboard/stats', authMiddleware, adminMiddleware, getDashboardStats);
router.get('/users', authMiddleware, adminMiddleware, getAllUsers);
router.get('/analytics', authMiddleware, adminMiddleware, getAnalytics);  // ✅ YENİ
router.put('/users/:userId/ban', authMiddleware, adminMiddleware, banUser);
router.put('/users/:userId/unban', authMiddleware, adminMiddleware, unbanUser);
router.delete('/users/:userId', authMiddleware, adminMiddleware, deleteUser);
router.get('/reports', authMiddleware, adminMiddleware, getReports);
router.put('/reports/:reportId/review', authMiddleware, adminMiddleware, reviewReport);

export default router;