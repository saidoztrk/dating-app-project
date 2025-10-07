import { Request, Response } from 'express';
import { getDB } from '../config/database';

export const getProfile = async (req: Request, res: Response): Promise<void> => {
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
        SELECT 
          UserID,
          Email,
          FirstName,
          LastName,
          BirthDate,
          Gender,
          InterestedIn,
          Bio,
          Occupation,
          Education,
          Height,
          City,
          Country,
          IsPremium,
          PremiumTier,
          CreatedAt,
          LastActiveAt
        FROM Users
        WHERE UserID = @userId AND IsActive = 1
      `);

        if (result.recordset.length === 0) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }

        const user = result.recordset[0];

        res.status(200).json({
            success: true,
            data: {
                user
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }

        const {
            firstName,
            lastName,
            bio,
            occupation,
            education,
            height,
            city,
            country
        } = req.body;

        const db = getDB();

        // Build dynamic update query
        const updates: string[] = [];
        const request = db.request().input('userId', userId);

        if (firstName !== undefined) {
            updates.push('FirstName = @firstName');
            request.input('firstName', firstName);
        }
        if (lastName !== undefined) {
            updates.push('LastName = @lastName');
            request.input('lastName', lastName);
        }
        if (bio !== undefined) {
            updates.push('Bio = @bio');
            request.input('bio', bio);
        }
        if (occupation !== undefined) {
            updates.push('Occupation = @occupation');
            request.input('occupation', occupation);
        }
        if (education !== undefined) {
            updates.push('Education = @education');
            request.input('education', education);
        }
        if (height !== undefined) {
            updates.push('Height = @height');
            request.input('height', height);
        }
        if (city !== undefined) {
            updates.push('City = @city');
            request.input('city', city);
        }
        if (country !== undefined) {
            updates.push('Country = @country');
            request.input('country', country);
        }

        if (updates.length === 0) {
            res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
            return;
        }

        updates.push('UpdatedAt = GETDATE()');

        const query = `
      UPDATE Users 
      SET ${updates.join(', ')}
      OUTPUT INSERTED.UserID, INSERTED.FirstName, INSERTED.LastName, INSERTED.Bio
      WHERE UserID = @userId
    `;

        const result = await request.query(query);

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: {
                user: result.recordset[0]
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const updateLocation = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
            return;
        }

        const { latitude, longitude, city, country } = req.body;

        if (!latitude || !longitude) {
            res.status(400).json({
                success: false,
                message: 'Latitude and longitude are required'
            });
            return;
        }

        const db = getDB();

        await db.request()
            .input('userId', userId)
            .input('latitude', latitude)
            .input('longitude', longitude)
            .input('city', city || null)
            .input('country', country || null)
            .query(`
        UPDATE Users 
        SET Latitude = @latitude, 
            Longitude = @longitude,
            City = @city,
            Country = @country,
            UpdatedAt = GETDATE()
        WHERE UserID = @userId
      `);

        res.status(200).json({
            success: true,
            message: 'Location updated successfully'
        });
    } catch (error) {
        console.error('Update location error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const db = getDB();

        const userResult = await db.request()
            .input('userId', userId)
            .query(`SELECT UserID, FirstName, BirthDate, Bio, City, Occupation FROM Users WHERE UserID = @userId`);

        const photosResult = await db.request()
            .input('userId', userId)
            .query(`SELECT PhotoURL, IsProfilePhoto FROM UserPhotos WHERE UserID = @userId ORDER BY PhotoOrder`);

        res.status(200).json({
            success: true,
            data: { user: userResult.recordset[0], photos: photosResult.recordset }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};