// backend/src/controllers/notificationController.ts
import { Request, Response } from 'express';
import { getDB } from '../config/database';

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { limit = 50, unreadOnly } = req.query;

        const db = getDB();

        let query = `
            SELECT 
                n.NotificationID,
                n.NotificationType,
                n.Title,
                n.Message,
                n.IsRead,
                n.CreatedAt,
                n.RelatedUserID,
                n.RelatedEntityID,
                u.FirstName AS RelatedUserName
            FROM Notifications n
            LEFT JOIN Users u ON n.RelatedUserID = u.UserID
            WHERE n.UserID = @userId
        `;

        if (unreadOnly === 'true') {
            query += ' AND n.IsRead = 0';
        }

        query += ' ORDER BY n.CreatedAt DESC';

        const result = await db.request()
            .input('userId', userId)
            .query(query);

        const countResult = await db.request()
            .input('userId', userId)
            .query('SELECT COUNT(*) as UnreadCount FROM Notifications WHERE UserID = @userId AND IsRead = 0');

        res.status(200).json({
            success: true,
            data: {
                notifications: result.recordset,
                unreadCount: countResult.recordset[0].UnreadCount
            }
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { notificationId } = req.params;

        const db = getDB();

        await db.request()
            .input('notificationId', notificationId)
            .input('userId', userId)
            .query(`
                UPDATE Notifications 
                SET IsRead = 1, ReadAt = GETDATE()
                WHERE NotificationID = @notificationId AND UserID = @userId
            `);

        res.status(200).json({
            success: true,
            message: 'Notification marked as read'
        });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const db = getDB();

        await db.request()
            .input('userId', userId)
            .query(`
                UPDATE Notifications 
                SET IsRead = 1, ReadAt = GETDATE()
                WHERE UserID = @userId AND IsRead = 0
            `);

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error('Mark all as read error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { notificationId } = req.params;

        const db = getDB();

        await db.request()
            .input('notificationId', notificationId)
            .input('userId', userId)
            .query('DELETE FROM Notifications WHERE NotificationID = @notificationId AND UserID = @userId');

        res.status(200).json({
            success: true,
            message: 'Notification deleted'
        });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const createNotification = async (
    userId: number,
    type: string,
    title: string,
    message: string,
    relatedUserId?: number,
    relatedEntityId?: number
) => {
    try {
        const db = getDB();

        await db.request()
            .input('userId', userId)
            .input('notificationType', type)
            .input('title', title)
            .input('message', message)
            .input('relatedUserId', relatedUserId || null)
            .input('relatedEntityId', relatedEntityId || null)
            .query(`
                INSERT INTO Notifications (UserID, NotificationType, Title, Message, RelatedUserID, RelatedEntityID)
                VALUES (@userId, @notificationType, @title, @message, @relatedUserId, @relatedEntityId)
            `);
    } catch (error) {
        console.error('Create notification error:', error);
    }
};