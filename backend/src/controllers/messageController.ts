// backend/src/controllers/messageController.ts
import { Request, Response } from 'express';
import { getDB } from '../config/database';
import { createNotification } from './notificationController';

export const getMessages = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { matchId } = req.params;
        const db = getDB();

        const result = await db.request()
            .input('matchId', matchId)
            .input('userId', userId)
            .query(`
                SELECT 
                    m.MessageID,
                    m.SenderUserID,
                    m.ReceiverUserID,
                    m.MessageText,
                    m.MessageType,
                    m.MediaURL,
                    m.IsRead,
                    m.SentAt
                FROM Messages m
                WHERE m.MatchID = @matchId
                ORDER BY m.SentAt ASC
            `);

        res.status(200).json({
            success: true,
            data: {
                messages: result.recordset
            }
        });
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { matchId } = req.params;
        const { messageText } = req.body;

        if (!messageText) {
            res.status(400).json({
                success: false,
                message: 'Message text is required'
            });
            return;
        }

        const db = getDB();

        // Get match details
        const matchResult = await db.request()
            .input('matchId', matchId)
            .input('userId', userId)
            .query(`
                SELECT User1ID, User2ID 
                FROM Matches 
                WHERE MatchID = @matchId 
                    AND (User1ID = @userId OR User2ID = @userId)
                    AND IsActive = 1
            `);

        if (matchResult.recordset.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Match not found'
            });
            return;
        }

        const match = matchResult.recordset[0];
        const receiverId = match.User1ID === userId ? match.User2ID : match.User1ID;

        // Insert message
        const result = await db.request()
            .input('matchId', matchId)
            .input('senderId', userId)
            .input('receiverId', receiverId)
            .input('messageText', messageText)
            .query(`
                INSERT INTO Messages (MatchID, SenderUserID, ReceiverUserID, MessageText)
                OUTPUT INSERTED.MessageID, INSERTED.MessageText, INSERTED.SentAt
                VALUES (@matchId, @senderId, @receiverId, @messageText)
            `);

        // Update LastMessageAt
        await db.request()
            .input('matchId', matchId)
            .query(`UPDATE Matches SET LastMessageAt = GETDATE() WHERE MatchID = @matchId`);

        // Get sender name for notification
        const senderResult = await db.request()
            .input('senderId', userId)
            .query('SELECT FirstName FROM Users WHERE UserID = @senderId');

        const senderName = senderResult.recordset[0].FirstName;

        // Send notification to receiver
        await createNotification(
            receiverId,
            'MESSAGE',
            'New Message 💬',
            `${senderName} sent you a message`,
            userId!,
            parseInt(matchId)
        );

        res.status(201).json({
            success: true,
            data: {
                message: result.recordset[0]
            }
        });
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};