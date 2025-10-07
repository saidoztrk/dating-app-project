import { Request, Response } from 'express';
import { getDB } from '../config/database';

export const getPlans = async (req: Request, res: Response): Promise<void> => {
    try {
        const plans = [
            {
                id: 'basic',
                name: 'Basic',
                price: 9.99,
                features: ['Unlimited likes', 'See who liked you', '1 Super Like/day']
            },
            {
                id: 'plus',
                name: 'Plus',
                price: 19.99,
                features: ['All Basic features', '5 Super Likes/day', 'Rewind', 'Boost 1x/month']
            },
            {
                id: 'gold',
                name: 'Gold',
                price: 29.99,
                features: ['All Plus features', 'Profile priority', 'See who read messages', 'Ad-free']
            }
        ];

        res.status(200).json({
            success: true,
            data: { plans }
        });
    } catch (error) {
        console.error('Get plans error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const subscribe = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { planType, transactionId } = req.body;

        const prices: any = { basic: 9.99, plus: 19.99, gold: 29.99 };
        const amount = prices[planType.toLowerCase()];

        const db = getDB();

        // Create subscription
        const result = await db.request()
            .input('userId', userId)
            .input('planType', planType)
            .input('amount', amount)
            .input('transactionId', transactionId)
            .input('endDate', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) // 30 days
            .query(`
        INSERT INTO Subscriptions (UserID, PlanType, Amount, EndDate, TransactionID, PaymentStatus)
        OUTPUT INSERTED.SubscriptionID
        VALUES (@userId, @planType, @amount, @endDate, @transactionId, 'active')
      `);

        // Update user premium status
        await db.request()
            .input('userId', userId)
            .input('planType', planType)
            .input('endDate', new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
            .query(`
        UPDATE Users 
        SET IsPremium = 1, PremiumTier = @planType, PremiumExpiryDate = @endDate
        WHERE UserID = @userId
      `);

        res.status(201).json({
            success: true,
            message: 'Subscription created successfully',
            data: { subscriptionId: result.recordset[0].SubscriptionID }
        });
    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getSubscriptionStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const db = getDB();

        const result = await db.request()
            .input('userId', userId)
            .query(`
        SELECT TOP 1 s.*, u.IsPremium, u.PremiumTier, u.PremiumExpiryDate
        FROM Subscriptions s
        INNER JOIN Users u ON s.UserID = u.UserID
        WHERE s.UserID = @userId AND s.IsActive = 1
        ORDER BY s.CreatedAt DESC
      `);

        res.status(200).json({
            success: true,
            data: { subscription: result.recordset[0] || null }
        });
    } catch (error) {
        console.error('Get subscription error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};