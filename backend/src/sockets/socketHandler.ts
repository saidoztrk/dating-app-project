import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { verifyAccessToken } from '../utils/jwt';
import { getDB } from '../config/database';

export const initializeSocket = (httpServer: HTTPServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:5173',
            credentials: true
        }
    });

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
        socket.join(`user_${userId}`);
        console.log(`User ${userId} connected`);

        socket.on('send_message', async (data) => {
            const { matchId, messageText, receiverId } = data;
            const db = getDB();

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

            const message = result.recordset[0];

            io.to(`user_${receiverId}`).emit('new_message', {
                ...message,
                SenderUserID: userId
            });
        });

        socket.on('disconnect', () => {
            console.log(`User ${userId} disconnected`);
        });
    });

    return io;
};