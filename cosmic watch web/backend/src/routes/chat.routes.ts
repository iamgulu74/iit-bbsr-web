import express from 'express';
import { getMessageHistory } from '../services/chat.service';

const router = express.Router();

// GET /api/v1/chat/:asteroidId - Get message history for an asteroid
router.get('/:asteroidId', async (req, res) => {
    try {
        const { asteroidId } = req.params;
        const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
        const messages = await getMessageHistory(asteroidId, limit);
        res.json(messages.reverse()); // Return in chronological order
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chat history' });
    }
});

export default router;
