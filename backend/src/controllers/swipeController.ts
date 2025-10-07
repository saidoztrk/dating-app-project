import { Request, Response } from 'express';
import { getDB } from '../config/database';

export const getPotentialMatches = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const limit = parseInt(req.query.limit as string) || 10;

        const db = getDB();

        const result = await db.request()
            .input('UserID', userId)
            .input('Limit', limit)
            .execute('sp_GetPotentialMatches');

        res.status(200).json({
            success: true,
            data: {
                users: result.recordset
            }
        });
    } catch (error) {
        console.error('Get potential matches error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const swipe = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { swipedUserId, swipeType } = req.body;

        if (!swipedUserId || !swipeType) {
            res.status(400).json({
                success: false,
                message: 'SwipedUserId and swipeType are required'
            });
            return;
        }

        if (!['LIKE', 'DISLIKE', 'SUPERLIKE'].includes(swipeType)) {
            res.status(400).json({
                success: false,
                message: 'Invalid swipe type'
            });
            return;
        }

        const db = getDB();

        // Insert swipe
        await db.request()
            .input('swipedByUserId', userId)
            .input('swipedUserId', swipedUserId)
            .input('swipeType', swipeType)
            .query(`
        INSERT INTO Swipes (SwipedByUserID, SwipedUserID, SwipeType)
        VALUES (@swipedByUserId, @swipedUserId, @swipeType)
      `);

        // Check for mutual like
        let isMatch = false;
        if (swipeType === 'LIKE' || swipeType === 'SUPERLIKE') {
            const mutualCheck = await db.request()
                .input('userId', userId)
                .input('swipedUserId', swipedUserId)
                .query(`
          SELECT SwipeID FROM Swipes
          WHERE SwipedByUserID = @swipedUserId 
            AND SwipedUserID = @userId 
            AND SwipeType IN ('LIKE', 'SUPERLIKE')
        `);

            if (mutualCheck.recordset.length > 0) {
                isMatch = true;

                // Create match
                await db.request()
                    .input('user1Id', Math.min(userId!, swipedUserId))
                    .input('user2Id', Math.max(userId!, swipedUserId))
                    .query(`
            INSERT INTO Matches (User1ID, User2ID)
            VALUES (@user1Id, @user2Id)
          `);
            }
        }

        res.status(200).json({
            success: true,
            message: isMatch ? 'It\'s a match!' : 'Swipe recorded',
            data: {
                isMatch
            }
        });
    } catch (error) {
        console.error('Swipe error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const getLikesReceived = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const db = getDB();

        const result = await db.request()
            .input('userId', userId)
            .query(`
        SELECT 
          u.UserID,
          u.FirstName,
          u.BirthDate,
          u.Bio,
          u.City,
          s.SwipedAt,
          DATEDIFF(YEAR, u.BirthDate, GETDATE()) AS Age
        FROM Swipes s
        INNER JOIN Users u ON s.SwipedByUserID = u.UserID
        WHERE s.SwipedUserID = @userId 
          AND s.SwipeType IN ('LIKE', 'SUPERLIKE')
        ORDER BY s.SwipedAt DESC
      `);

        res.status(200).json({
            success: true,
            data: {
                likes: result.recordset
            }
        });
    } catch (error) {
        console.error('Get likes received error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
export const rewindSwipe = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const db = getDB();

        // Get last swipe
        const result = await db.request()
            .input('userId', userId)
            .query(`
        SELECT TOP 1 SwipeID, SwipedUserID, SwipeType
        FROM Swipes
        WHERE SwipedByUserID = @userId
        ORDER BY SwipedAt DESC
      `);

        if (result.recordset.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No swipes to undo'
            });
            return;
        }

        const lastSwipe = result.recordset[0];

        // Delete last swipe
        await db.request()
            .input('swipeId', lastSwipe.SwipeID)
            .query('DELETE FROM Swipes WHERE SwipeID = @swipeId');

        res.status(200).json({
            success: true,
            message: 'Swipe undone',
            data: { swipedUserId: lastSwipe.SwipedUserID }
        });
    } catch (error) {
        console.error('Rewind error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};