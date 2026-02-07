import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import ChatMessage from '../models/ChatMessage';

// Extend Socket type to include user
interface AuthSocket extends Socket {
    user?: any;
}


export const initChatService = (io: SocketIOServer) => {

    // Auth Middleware
    io.use((socket: AuthSocket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error("No token provided"));

        jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
            if (err) return next(new Error("Unauthorized"));
            socket.user = user;
            next();
        });
    });

    io.on('connection', (socket: AuthSocket) => {
        console.log(`User connected: ${socket.user?.username || socket.id}`);

        // Global Community Chat
        socket.on('sendMessage', (msg: string) => {
            // Broadcast to all
            const userName = socket.user?.displayName || socket.user?.email?.split('@')[0] || 'Anonymous';
            io.emit('receiveMessage', {
                user: userName,
                msg,
                timestamp: new Date()
            });
        });

        // Keep existing Asteroid Room logic if needed, but prioritize Community Chat for now
        socket.on('join-room', (roomId: string) => {
            socket.join(roomId);
            console.log(`User ${socket.user?.username} joined ${roomId}`);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
};

// REST endpoints for message history
export const getMessageHistory = async (asteroidId: string, limit: number = 50) => {
    return await ChatMessage.find({ asteroidId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
};
