import { Request, Response, NextFunction } from 'express';
import { getDB } from '../config/database';

export const premiumMiddleware = async (
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

        const result = await db.request()
            .input('userId', userId)
            .query(`
        SELECT IsPremium, PremiumExpiryDate 
        FROM Users 
        WHERE UserID = @userId
      `);

        const user = result.recordset[0];

        if (!user.IsPremium || new Date(user.PremiumExpiryDate) < new Date()) {
            res.status(403).json({
                success: false,
                message: 'Premium subscription required',
                upgrade: true
            });
            return;
        }

        next();
    } catch (error) {
        console.error('Premium middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};