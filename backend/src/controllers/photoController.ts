import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { getDB } from '../config/database';

export const uploadPhoto = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        if (!req.file) {
            res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
            return;
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'dating-app',
            transformation: [
                { width: 800, height: 800, crop: 'fill', quality: 'auto' }
            ]
        });

        const db = getDB();

        // Get current photo count
        const countResult = await db.request()
            .input('userId', userId)
            .query('SELECT COUNT(*) as PhotoCount FROM UserPhotos WHERE UserID = @userId');

        const photoCount = countResult.recordset[0].PhotoCount;

        if (photoCount >= 6) {
            res.status(400).json({
                success: false,
                message: 'Maximum 6 photos allowed'
            });
            return;
        }

        // Insert photo
        const insertResult = await db.request()
            .input('userId', userId)
            .input('photoUrl', result.secure_url)
            .input('thumbnailUrl', result.secure_url)
            .input('photoOrder', photoCount)
            .input('isProfilePhoto', photoCount === 0 ? 1 : 0)
            .query(`
        INSERT INTO UserPhotos (UserID, PhotoURL, ThumbnailURL, PhotoOrder, IsProfilePhoto)
        OUTPUT INSERTED.PhotoID, INSERTED.PhotoURL, INSERTED.PhotoOrder, INSERTED.IsProfilePhoto
        VALUES (@userId, @photoUrl, @thumbnailUrl, @photoOrder, @isProfilePhoto)
      `);

        res.status(201).json({
            success: true,
            message: 'Photo uploaded successfully',
            data: {
                photo: insertResult.recordset[0]
            }
        });
    } catch (error) {
        console.error('Upload photo error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const deletePhoto = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { photoId } = req.params;

        const db = getDB();

        // Check ownership
        const photoResult = await db.request()
            .input('photoId', photoId)
            .input('userId', userId)
            .query('SELECT PhotoURL FROM UserPhotos WHERE PhotoID = @photoId AND UserID = @userId');

        if (photoResult.recordset.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Photo not found'
            });
            return;
        }

        // Delete from database
        await db.request()
            .input('photoId', photoId)
            .query('DELETE FROM UserPhotos WHERE PhotoID = @photoId');

        res.status(200).json({
            success: true,
            message: 'Photo deleted successfully'
        });
    } catch (error) {
        console.error('Delete photo error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

export const getUserPhotos = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const db = getDB();

        const result = await db.request()
            .input('userId', userId)
            .query(`
        SELECT PhotoID, PhotoURL, ThumbnailURL, PhotoOrder, IsProfilePhoto
        FROM UserPhotos
        WHERE UserID = @userId
        ORDER BY PhotoOrder
      `);

        res.status(200).json({
            success: true,
            data: {
                photos: result.recordset
            }
        });
    } catch (error) {
        console.error('Get photos error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};