import express from 'express';
import Watchlist from '../models/Watchlist';
import Asteroid, { IAsteroid } from '../models/Asteroid';
import { authenticate, AuthRequest } from '../middleware/auth';
import * as nasaService from '../services/nasa.service';

const router = express.Router();

router.use(authenticate);

// Get User's Watchlist
router.get('/', async (req: AuthRequest, res) => {
    try {
        const watchlist = await Watchlist.find({ user: req.user?.id })
            .populate('asteroid')
            .sort({ addedAt: -1 });
        res.json(watchlist);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching watchlist', error });
    }
});

// Add to Watchlist
router.post('/', async (req: AuthRequest, res) => {
    try {
        const { asteroidId, alertThreshold } = req.body; // asteroidId is the NASA ID string

        // 1. Ensure asteroid exists in our DB (fetch from NASA if needed)
        let asteroid: IAsteroid | null = await Asteroid.findOne({ nasaId: asteroidId });
        if (!asteroid) {
            const nasaData = await nasaService.fetchNeoLookup(asteroidId);
            asteroid = await nasaService.updateAsteroidData(nasaData);
        }

        if (!asteroid) {
            throw new Error('Failed to retrieve asteroid data');
        }

        // 2. Add to watchlist
        const watchlistItem = new Watchlist({
            user: req.user?.id,
            asteroid: asteroid._id,
            alertThreshold,
        });

        await watchlistItem.save();

        // Populate asteroid data for response
        await watchlistItem.populate('asteroid');

        res.status(201).json(watchlistItem);
    } catch (error: any) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Asteroid already in watchlist' });
        }
        res.status(500).json({ message: 'Error adding to watchlist', error });
    }
});

// Remove from Watchlist
router.delete('/:id', async (req: AuthRequest, res) => {
    try {
        const result = await Watchlist.findOneAndDelete({
            _id: req.params.id,
            user: req.user?.id
        });

        if (!result) {
            return res.status(404).json({ message: 'Watchlist item not found' });
        }

        res.json({ message: 'Removed from watchlist' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing from watchlist', error });
    }
});

// Update Alert Settings
router.put('/:id', async (req: AuthRequest, res) => {
    try {
        const { alertThreshold, alertsEnabled } = req.body;

        const watchlistItem = await Watchlist.findOneAndUpdate(
            { _id: req.params.id, user: req.user?.id },
            { alertThreshold, alertsEnabled },
            { new: true }
        ).populate('asteroid');

        if (!watchlistItem) {
            return res.status(404).json({ message: 'Watchlist item not found' });
        }

        res.json(watchlistItem);
    } catch (error) {
        res.status(500).json({ message: 'Error updating watchlist', error });
    }
});

export default router;
