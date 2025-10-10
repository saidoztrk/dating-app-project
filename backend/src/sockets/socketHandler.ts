// backend/src/sockets/socketHandler.ts
import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verifyAccessToken } from '../utils/jwt';
import { getDB } from '../config/database';
import { createNotification } from '../controllers/notificationController';

export const initializeSocket = (httpServer: HTTPServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            credentials: true
        }
    });

    // Authentication middleware
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error'));
        }
        try {
            const decoded = verifyAccessToken(token);
            socket.data.userId = decoded.userId;
            next();
        } catch (err) {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        const userId = socket.data.userId;

        // Join user's personal room
        socket.join(`user_${userId}`);

        console.log(`✅ User ${userId} connected to Socket.io`);

        // Update user's online status
        updateUserStatus(userId, true);

        // Handle typing indicator
        socket.on('typing_start', (data) => {
            const { matchId, receiverId } = data;
            io.to(`user_${receiverId}`).emit('user_typing', {
                matchId,
                userId,
                isTyping: true
            });
        });

        socket.on('typing_stop', (data) => {
            const { matchId, receiverId } = data;
            io.to(`user_${receiverId}`).emit('user_typing', {
                matchId,
                userId,
                isTyping: false
            });
        });

        // Handle sending messages
        socket.on('send_message', async (data) => {
            const { matchId, messageText, receiverId } = data;
            const db = getDB();

            try {
                // Insert message to database
                const result = await db.request()
                    .input('matchId', matchId)
                    .input('senderId', userId)
                    .input('receiverId', receiverId)
                    .input('messageText', messageText)
                    .query(`
                        INSERT INTO Messages (MatchID, SenderUserID, ReceiverUserID, MessageText)
                        OUTPUT INSERTED.MessageID, INSERTED.MessageText, INSERTED.SentAt, INSERTED.SenderUserID
                        VALUES (@matchId, @senderId, @receiverId, @messageText)
                    `);

                const message = result.recordset[0];

                // Update LastMessageAt
                await db.request()
                    .input('matchId', matchId)
                    .query('UPDATE Matches SET LastMessageAt = GETDATE() WHERE MatchID = @matchId');

                // Send real-time message to receiver
                io.to(`user_${receiverId}`).emit('new_message', message);

                // Send confirmation to sender
                socket.emit('message_sent', message);

                // Get sender name for notification
                const senderResult = await db.request()
                    .input('senderId', userId)
                    .query('SELECT FirstName FROM Users WHERE UserID = @senderId');

                const senderName = senderResult.recordset[0].FirstName;

                // Create notification
                await createNotification(
                    receiverId,
                    'MESSAGE',
                    'New Message 💬',
                    `${senderName} sent you a message`,
                    userId,
                    matchId
                );

                // Send real-time notification
                io.to(`user_${receiverId}`).emit('new_notification', {
                    type: 'MESSAGE',
                    title: 'New Message',
                    message: `${senderName} sent you a message`
                });

            } catch (error) {
                console.error('Send message error:', error);
                socket.emit('message_error', { error: 'Failed to send message' });
            }
        });

        // Handle message read receipts
        socket.on('mark_read', async (data) => {
            const { messageId, senderId } = data;
            const db = getDB();

            try {
                await db.request()
                    .input('messageId', messageId)
                    .query('UPDATE Messages SET IsRead = 1, ReadAt = GETDATE() WHERE MessageID = @messageId');

                // Notify sender that message was read
                io.to(`user_${senderId}`).emit('message_read', { messageId });
            } catch (error) {
                console.error('Mark read error:', error);
            }
        });

        // Handle disconnect
        socket.on('disconnect', () => {
            console.log(`❌ User ${userId} disconnected from Socket.io`);
            updateUserStatus(userId, false);
        });
    });

    return io;
};

// Helper function to update user online status
const updateUserStatus = async (userId: number, isOnline: boolean) => {
    try {
        const db = getDB();
        await db.request()
            .input('userId', userId)
            .query(`
                UPDATE Users 
                SET LastActiveAt = GETDATE()
                WHERE UserID = @userId
            `);
    } catch (error) {
        console.error('Update user status error:', error);
    }
};