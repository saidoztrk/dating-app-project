import { Request, Response } from 'express';
import { getDB } from '../config/database';

export const getMatches = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const db = getDB();

        const result = await db.request()
            .input('userId', userId)
            .query(`
        SELECT 
          m.MatchID,
          m.MatchedAt,
          m.LastMessageAt,
          CASE 
            WHEN m.User1ID = @userId THEN u2.UserID
            ELSE u1.UserID
          END AS MatchedUserID,
          CASE 
            WHEN m.User1ID = @userId THEN u2.FirstName
            ELSE u1.FirstName
          END AS FirstName,
          CASE 
            WHEN m.User1ID = @userId THEN u2.Bio
            ELSE u1.Bio
          END AS Bio,
          (SELECT TOP 1 msg.MessageText 
           FROM Messages msg 
           WHERE msg.MatchID = m.MatchID 
           ORDER BY msg.SentAt DESC) AS LastMessage
        FROM Matches m
        INNER JOIN Users u1 ON m.User1ID = u1.UserID
        INNER JOIN Users u2 ON m.User2ID = u2.UserID
        WHERE (m.User1ID = @userId OR m.User2ID = @userId)
          AND m.IsActive = 1
        ORDER BY COALESCE(m.LastMessageAt, m.MatchedAt) DESC
      `);

        res.status(200).json({
            success: true,
            data: {
                matches: result.recordset
            }
        });
    } catch (error) {
        console.error('Get matches error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};