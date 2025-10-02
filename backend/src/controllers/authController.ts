import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { getDB } from '../config/database';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                errors: errors.array()
            });
            return;
        }

        const { email, password, firstName, lastName, birthDate, gender, interestedIn } = req.body;

        const db = getDB();

        // Check if email already exists
        const existingUser = await db.request()
            .input('email', email)
            .query('SELECT UserID FROM Users WHERE Email = @email');

        if (existingUser.recordset.length > 0) {
            res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
            return;
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert user
        const result = await db.request()
            .input('email', email)
            .input('passwordHash', passwordHash)
            .input('firstName', firstName)
            .input('lastName', lastName || null)
            .input('birthDate', birthDate)
            .input('gender', gender)
            .input('interestedIn', interestedIn)
            .query(`
        INSERT INTO Users (Email, PasswordHash, FirstName, LastName, BirthDate, Gender, InterestedIn)
        OUTPUT INSERTED.UserID, INSERTED.Email, INSERTED.FirstName
        VALUES (@email, @passwordHash, @firstName, @lastName, @birthDate, @gender, @interestedIn)
      `);

        const user = result.recordset[0];

        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user.UserID,
            email: user.Email
        });

        const refreshToken = generateRefreshToken({
            userId: user.UserID,
            email: user.Email
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    userId: user.UserID,
                    email: user.Email,
                    firstName: user.FirstName
                },
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                success: false,
                errors: errors.array()
            });
            return;
        }

        const { email, password } = req.body;

        const db = getDB();

        // Find user
        const result = await db.request()
            .input('email', email)
            .query(`
        SELECT UserID, Email, PasswordHash, FirstName, IsActive, IsBanned
        FROM Users
        WHERE Email = @email
      `);

        if (result.recordset.length === 0) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }

        const user = result.recordset[0];

        // Check if banned
        if (user.IsBanned) {
            res.status(403).json({
                success: false,
                message: 'Account is banned'
            });
            return;
        }

        // Check if active
        if (!user.IsActive) {
            res.status(403).json({
                success: false,
                message: 'Account is deactivated'
            });
            return;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);

        if (!isPasswordValid) {
            res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
            return;
        }

        // Update last active
        await db.request()
            .input('userId', user.UserID)
            .query('UPDATE Users SET LastActiveAt = GETDATE() WHERE UserID = @userId');

        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user.UserID,
            email: user.Email
        });

        const refreshToken = generateRefreshToken({
            userId: user.UserID,
            email: user.Email
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    userId: user.UserID,
                    email: user.Email,
                    firstName: user.FirstName
                },
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login'
        });
    }
};