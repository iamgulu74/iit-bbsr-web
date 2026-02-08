import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
    cors: {
        origin: [
            process.env.FRONTEND_URL || 'http://localhost:8080',
            'http://localhost:3000',
            'http://localhost:8080',
            'http://127.0.0.1:8080',
            'http://localhost',
            'http://127.0.0.1'
        ],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

const port = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Database connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/cosmicwatch';
mongoose.connect(mongoUri)
    .then(() => {
        console.log('Connected to MongoDB');
        initNotificationService(io);
    })
    .catch((err) => console.error('MongoDB connection error:', err));

import { initNotificationService } from './services/notification.service';
import { initChatService } from './services/chat.service';

import authRoutes from './routes/auth.routes';
import asteroidRoutes from './routes/asteroid.routes';
import watchlistRoutes from './routes/watchlist.routes';
import notificationRoutes from './routes/notification.routes';
import chatRoutes from './routes/chat.routes';
import userRoutes from './routes/user.routes';

// Routes
app.get('/api/v1', (req, res) => {
    res.json({ status: 'success', message: 'Cosmic Watch API v1 is active' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/asteroids', asteroidRoutes);
app.use('/api/v1/watchlist', watchlistRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/chat', chatRoutes);
app.get('/', (req, res) => {
    res.send('Cosmic Watch API is running');
});

// Initialize Socket.IO chat service
initChatService(io);

// Start server
httpServer.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
