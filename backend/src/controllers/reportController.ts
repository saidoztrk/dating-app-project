// backend/src/controllers/reportController.ts
import { Request, Response } from 'express';
import { getDB } from '../config/database';

export const createReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const reporterUserId = req.user?.userId;
        const { reportedUserId, reportType, reason } = req.body;

        if (!reportedUserId || !reportType) {
            res.status(400).json({
                success: false,
                message: 'reportedUserId and reportType are required'
            });
            return;
        }

        const db = getDB();

        // Check if already reported recently
        const existingReport = await db.request()
            .input('reporterUserId', reporterUserId)
            .input('reportedUserId', reportedUserId)
            .query(`
                SELECT ReportID 
                FROM Reports 
                WHERE ReporterUserID = @reporterUserId 
                    AND ReportedUserID = @reportedUserId
                    AND CreatedAt >= DATEADD(day, -7, GETDATE())
            `);

        if (existingReport.recordset.length > 0) {
            res.status(400).json({
                success: false,
                message: 'You have already reported this user recently'
            });
            return;
        }

        // Create report
        await db.request()
            .input('reporterUserId', reporterUserId)
            .input('reportedUserId', reportedUserId)
            .input('reportType', reportType)
            .input('reason', reason || null)
            .query(`
                INSERT INTO Reports (ReporterUserID, ReportedUserID, ReportType, Reason)
                VALUES (@reporterUserId, @reportedUserId, @reportType, @reason)
            `);

        res.status(201).json({
            success: true,
            message: 'Report submitted successfully'
        });
    } catch (error) {
        console.error('Create report error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};