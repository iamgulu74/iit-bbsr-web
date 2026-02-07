import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    displayName: z.string().optional(),
});

// Register
router.post('/register', async (req, res) => {
    try {
        const { email, password, displayName } = registerSchema.parse(req.body);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({ email, passwordHash, displayName });
        await user.save();

        const token = jwt.sign(
            { id: user._id, email: user.email, displayName: user.displayName },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        );

        res.status(201).json({ token, user: { id: user._id, email: user.email, displayName: user.displayName } });
    } catch (error) {
        res.status(400).json({ message: 'Invalid input', error });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, email: user.email, displayName: user.displayName },
            process.env.JWT_SECRET as string,
            { expiresIn: '24h' }
        );
        res.json({ token, user: { id: user._id, email: user.email, displayName: user.displayName } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Current User
router.get('/me', authenticate, async (req: AuthRequest, res) => {
    try {
        const user = await User.findById(req.user?.id).select('-passwordHash');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
