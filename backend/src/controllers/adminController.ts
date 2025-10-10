// backend/src/controllers/adminController.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { getDB } from '../config/database';
import { generateAccessToken } from '../utils/jwt';

// Admin Login
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const db = getDB();

        const result = await db.request()
            .input('email', email)
            .query(`
                SELECT AdminID, Email, PasswordHash, FirstName, LastName, Role, IsActive
                FROM AdminUsers
                WHERE Email = @email
            `);

        if (result.recordset.length === 0) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
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

        const isPasswordValid = await bcrypt.compare(password, admin.PasswordHash);

        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }

        // Update last login
        await db.request()
            .input('adminId', admin.AdminID)
            .query('UPDATE AdminUsers SET LastLoginAt = GETDATE() WHERE AdminID = @adminId');

        const token = generateAccessToken({
            userId: admin.AdminID,
            email: admin.Email,
            role: admin.Role
        });

        res.status(200).json({
            success: true,
            message: 'Admin login successful',
            data: {
                admin: {
                    adminId: admin.AdminID,
                    email: admin.Email,
                    firstName: admin.FirstName,
                    lastName: admin.LastName,
                    role: admin.Role
                },
                token
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get Dashboard Stats
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const db = getDB();

        // Total Users
        const usersResult = await db.request()
            .query('SELECT COUNT(*) as TotalUsers FROM Users WHERE IsActive = 1');

        // New Users Today
        const newUsersResult = await db.request()
            .query('SELECT COUNT(*) as NewUsers FROM Users WHERE CAST(CreatedAt AS DATE) = CAST(GETDATE() AS DATE)');

        // Total Matches
        const matchesResult = await db.request()
            .query('SELECT COUNT(*) as TotalMatches FROM Matches WHERE IsActive = 1');

        // Active Users (last 7 days)
        const activeUsersResult = await db.request()
            .query('SELECT COUNT(*) as ActiveUsers FROM Users WHERE LastActiveAt >= DATEADD(day, -7, GETDATE())');

        // Premium Users
        const premiumUsersResult = await db.request()
            .query('SELECT COUNT(*) as PremiumUsers FROM Users WHERE IsPremium = 1 AND PremiumExpiryDate > GETDATE()');

        // Pending Reports
        const reportsResult = await db.request()
            .query('SELECT COUNT(*) as PendingReports FROM Reports WHERE Status = \'PENDING\'');

        // Messages Today
        const messagesResult = await db.request()
            .query('SELECT COUNT(*) as MessagesToday FROM Messages WHERE CAST(SentAt AS DATE) = CAST(GETDATE() AS DATE)');

        // Revenue (mock - will be real with Stripe)
        const revenueResult = await db.request()
            .query(`
                SELECT 
                    COUNT(*) as TotalSubscriptions,
                    SUM(Amount) as TotalRevenue
                FROM Subscriptions
                WHERE IsActive = 1
            `);

        res.status(200).json({
            success: true,
            data: {
                totalUsers: usersResult.recordset[0].TotalUsers,
                newUsersToday: newUsersResult.recordset[0].NewUsers,
                totalMatches: matchesResult.recordset[0].TotalMatches,
                activeUsers: activeUsersResult.recordset[0].ActiveUsers,
                premiumUsers: premiumUsersResult.recordset[0].PremiumUsers,
                pendingReports: reportsResult.recordset[0].PendingReports,
                messagesToday: messagesResult.recordset[0].MessagesToday,
                totalSubscriptions: revenueResult.recordset[0].TotalSubscriptions || 0,
                totalRevenue: revenueResult.recordset[0].TotalRevenue || 0
            }
        });
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get All Users (with pagination)
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 1, limit = 20, search = '', filter = 'all' } = req.query;
        const offset = (Number(page) - 1) * Number(limit);

        const db = getDB();

        let whereClause = 'WHERE 1=1';

        if (search) {
            whereClause += ` AND (FirstName LIKE '%${search}%' OR Email LIKE '%${search}%')`;
        }

        if (filter === 'premium') {
            whereClause += ' AND IsPremium = 1';
        } else if (filter === 'banned') {
            whereClause += ' AND IsBanned = 1';
        } else if (filter === 'active') {
            whereClause += ' AND IsActive = 1 AND IsBanned = 0';
        }

        const result = await db.request()
            .query(`
                SELECT 
                    UserID,
                    Email,
                    FirstName,
                    LastName,
                    Gender,
                    City,
                    IsPremium,
                    PremiumTier,
                    IsBanned,
                    IsActive,
                    CreatedAt,
                    LastActiveAt
                FROM Users
                ${whereClause}
                ORDER BY CreatedAt DESC
                OFFSET ${offset} ROWS
                FETCH NEXT ${limit} ROWS ONLY
            `);

        const countResult = await db.request()
            .query(`SELECT COUNT(*) as Total FROM Users ${whereClause}`);

        res.status(200).json({
            success: true,
            data: {
                users: result.recordset,
                total: countResult.recordset[0].Total,
                page: Number(page),
                totalPages: Math.ceil(countResult.recordset[0].Total / Number(limit))
            }
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Ban User
export const banUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const { reason } = req.body;
        const adminId = req.user?.userId;

        const db = getDB();

        await db.request()
            .input('userId', userId)
            .query('UPDATE Users SET IsBanned = 1 WHERE UserID = @userId');

        // Log admin activity
        await db.request()
            .input('adminId', adminId)
            .input('action', 'BAN_USER')
            .input('targetType', 'USER')
            .input('targetId', userId)
            .input('details', reason || 'No reason provided')
            .query(`
                INSERT INTO AdminActivityLog (AdminID, Action, TargetType, TargetID, Details)
                VALUES (@adminId, @action, @targetType, @targetId, @details)
            `);

        res.status(200).json({
            success: true,
            message: 'User banned successfully'
        });
    } catch (error) {
        console.error('Ban user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Unban User
export const unbanUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const adminId = req.user?.userId;

        const db = getDB();

        await db.request()
            .input('userId', userId)
            .query('UPDATE Users SET IsBanned = 0 WHERE UserID = @userId');

        // Log admin activity
        await db.request()
            .input('adminId', adminId)
            .input('action', 'UNBAN_USER')
            .input('targetType', 'USER')
            .input('targetId', userId)
            .query(`
                INSERT INTO AdminActivityLog (AdminID, Action, TargetType, TargetID, Details)
                VALUES (@adminId, @action, @targetType, @targetId, 'User unbanned')
            `);

        res.status(200).json({
            success: true,
            message: 'User unbanned successfully'
        });
    } catch (error) {
        console.error('Unban user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Delete User
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId } = req.params;
        const adminId = req.user?.userId;

        const db = getDB();

        // Soft delete
        await db.request()
            .input('userId', userId)
            .query('UPDATE Users SET IsActive = 0, Email = CONCAT(Email, \'_deleted_\', UserID) WHERE UserID = @userId');

        // Log admin activity
        await db.request()
            .input('adminId', adminId)
            .input('action', 'DELETE_USER')
            .input('targetType', 'USER')
            .input('targetId', userId)
            .query(`
                INSERT INTO AdminActivityLog (AdminID, Action, TargetType, TargetID, Details)
                VALUES (@adminId, @action, @targetType, @targetId, 'User deleted')
            `);

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Get All Reports
export const getReports = async (req: Request, res: Response): Promise<void> => {
    try {
        const { status = 'PENDING' } = req.query;

        const db = getDB();

        const result = await db.request()
            .input('status', status)
            .query(`
                SELECT 
                    r.ReportID,
                    r.ReportType,
                    r.Reason,
                    r.Status,
                    r.CreatedAt,
                    u1.FirstName as ReporterName,
                    u1.Email as ReporterEmail,
                    u2.FirstName as ReportedName,
                    u2.Email as ReportedEmail,
                    u2.UserID as ReportedUserID
                FROM Reports r
                INNER JOIN Users u1 ON r.ReporterUserID = u1.UserID
                INNER JOIN Users u2 ON r.ReportedUserID = u2.UserID
                WHERE r.Status = @status
                ORDER BY r.CreatedAt DESC
            `);

        res.status(200).json({
            success: true,
            data: {
                reports: result.recordset
            }
        });
    } catch (error) {
        console.error('Get reports error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// Review Report
export const reviewReport = async (req: Request, res: Response): Promise<void> => {
    try {
        const { reportId } = req.params;
        const { action, status } = req.body; // action: 'BAN', 'WARNING', 'NONE'
        const adminId = req.user?.userId;

        const db = getDB();

        // Update report
        await db.request()
            .input('reportId', reportId)
            .input('status', status)
            .input('adminId', adminId)
            .input('action', action)
            .query(`
                UPDATE Reports
                SET Status = @status,
                    ReviewedBy = @adminId,
                    ActionTaken = @action,
                    ReviewedAt = GETDATE()
                WHERE ReportID = @reportId
            `);

        // If action is BAN, ban the user
        if (action === 'BAN') {
            const reportResult = await db.request()
                .input('reportId', reportId)
                .query('SELECT ReportedUserID FROM Reports WHERE ReportID = @reportId');

            const reportedUserId = reportResult.recordset[0].ReportedUserID;

            await db.request()
                .input('userId', reportedUserId)
                .query('UPDATE Users SET IsBanned = 1 WHERE UserID = @userId');
        }

        // Log activity
        await db.request()
            .input('adminId', adminId)
            .input('action', 'REVIEW_REPORT')
            .input('targetType', 'REPORT')
            .input('targetId', reportId)
            .input('details', `Status: ${status}, Action: ${action}`)
            .query(`
                INSERT INTO AdminActivityLog (AdminID, Action, TargetType, TargetID, Details)
                VALUES (@adminId, @action, @targetType, @targetId, @details)
            `);

        res.status(200).json({
            success: true,
            message: 'Report reviewed successfully'
        });
    } catch (error) {
        console.error('Review report error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

// ✅ NEW: Get Analytics - SQL hatalarından bağımsız
export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
        const db = getDB();

        // Basit count sorguları (CreatedAt kullanmadan)
        const usersCount = await db.request().query(`SELECT COUNT(*) as total FROM Users`);
        const matchesCount = await db.request().query(`SELECT COUNT(*) as total FROM Matches`);
        const messagesCount = await db.request().query(`SELECT COUNT(*) as total FROM Messages`);
        const premiumCount = await db.request().query(`SELECT COUNT(*) as total FROM Users WHERE IsPremium = 1`);

        // Subscriptions verisi
        const subscriptionsData = await db.request().query(`
            SELECT 
                ISNULL(PlanType, 'Basic') as tier,
                COUNT(*) as count,
                ISNULL(SUM(Amount), 0) as revenue
            FROM Subscriptions
            WHERE IsActive = 1
            GROUP BY PlanType
        `);

        const totalRevenue = await db.request().query(`
            SELECT ISNULL(SUM(Amount), 0) as total FROM Subscriptions WHERE IsActive = 1
        `);

        // Gender distribution
        const genderData = await db.request().query(`
            SELECT 
                ISNULL(Gender, 'Unknown') as name,
                COUNT(*) as value
            FROM Users
            GROUP BY Gender
        `);

        // Mock data for charts (gerçek tarih kolonları olmadığı için)
        const mockUserGrowth = [
            { date: '2025-10-03', users: 2 },
            { date: '2025-10-04', users: 1 },
            { date: '2025-10-05', users: 3 },
            { date: '2025-10-06', users: 2 },
            { date: '2025-10-07', users: 2 },
            { date: '2025-10-08', users: 0 },
            { date: '2025-10-09', users: 0 }
        ];

        const mockMatchStats = [
            { date: '2025-10-03', matches: 1, messages: 5 },
            { date: '2025-10-04', matches: 0, messages: 3 },
            { date: '2025-10-05', matches: 1, messages: 8 },
            { date: '2025-10-06', matches: 0, messages: 4 },
            { date: '2025-10-07', matches: 0, messages: 2 }
        ];

        const mockAgeDistribution = [
            { range: '18-24', count: 3 },
            { range: '25-34', count: 5 },
            { range: '35-44', count: 2 },
            { range: '45-54', count: 0 },
            { range: '55+', count: 0 }
        ];

        res.status(200).json({
            overview: {
                totalUsers: usersCount.recordset[0].total,
                activeUsers: usersCount.recordset[0].total,
                premiumUsers: premiumCount.recordset[0].total,
                totalMatches: matchesCount.recordset[0].total,
                totalMessages: messagesCount.recordset[0].total,
                totalRevenue: totalRevenue.recordset[0].total
            },
            userGrowth: mockUserGrowth,
            genderDistribution: genderData.recordset.length > 0 ? genderData.recordset : [
                { name: 'Male', value: 5 },
                { name: 'Female', value: 5 }
            ],
            premiumStats: subscriptionsData.recordset.length > 0 ? subscriptionsData.recordset : [
                { tier: 'Basic', count: 0, revenue: 0 },
                { tier: 'Plus', count: 0, revenue: 0 },
                { tier: 'Premium', count: 0, revenue: 0 }
            ],
            matchStats: mockMatchStats,
            ageDistribution: mockAgeDistribution
        });

    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({
            error: 'Failed to fetch analytics',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// TEST - Hash oluştur (sadece development için)
export const generateHash = async (req: Request, res: Response): Promise<void> => {
    try {
        const { password } = req.body;
        const hash = await bcrypt.hash(password, 10);

        res.status(200).json({
            success: true,
            data: { hash }
        });
    } catch (error) {
        console.error('Hash generation error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};