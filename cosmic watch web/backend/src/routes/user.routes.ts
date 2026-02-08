import express from 'express';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';
import { z } from 'zod';

const router = express.Router();

const settingsSchema = z.object({
    displayName: z.string().optional(),
    alertSettings: z.object({
        daysBeforeApproach: z.array(z.number()),
        minRiskLevel: z.enum(['low', 'medium', 'high', 'critical']),
        notifyAll: z.boolean(),
        notifyWatchedOnly: z.boolean(),
        emailEnabled: z.boolean().optional(),
        smsEnabled: z.boolean().optional()
    }).optional()
});

// Update Settings
router.put('/settings', authenticate, async (req: AuthRequest, res) => {
    try {
        const validatedData = settingsSchema.parse(req.body);
        const user = await User.findById(req.user?.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (validatedData.displayName) user.displayName = validatedData.displayName;
        if (validatedData.alertSettings) {
            user.alertSettings = { ...user.alertSettings, ...validatedData.alertSettings };
        }

        await user.save();
        res.json({
            message: 'Settings updated successfully', user: {
                id: user._id,
                displayName: user.displayName,
                alertSettings: user.alertSettings
            }
        });
    } catch (error) {
        res.status(400).json({ message: 'Invalid input', error });
    }
});

export default router;
