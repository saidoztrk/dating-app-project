// backend/src/middleware/adminMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { getDB } from '../config/database';

export const adminMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }

        const db = getDB();

        // Check if user is admin
        const result = await db.request()
            .input('adminId', userId)
            .query(`
                SELECT AdminID, Role, IsActive 
                FROM AdminUsers 
                WHERE AdminID = @adminId
            `);

        if (result.recordset.length === 0) {
            res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
            return;
        }

        const admin = result.recordset[0];

        if (!admin.IsActive) {
            res.status(403).json({
                success: false,
                message: 'Admin account is deactivated'
            });
            return;
        }

        // Add admin info to request
        if (req.user) {
            req.user.role = admin.Role;
        }

        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};