import express from 'express';
import * as nasaService from '../services/nasa.service';
import Asteroid, { IAsteroid } from '../models/Asteroid';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get Asteroid Feed (Proxies to NASA and caches/updates DB)
router.get('/feed', async (req, res) => {
    try {
        const { start_date, end_date } = req.query;
        if (!start_date || !end_date) {
            return res.status(400).json({ message: 'Start and End dates are required' });
        }

        const nasaData = await nasaService.fetchNeoFeed(start_date as string, end_date as string);

        // Process and sort concurrent updates
        const processedAsteroids = [];
        const nearEarthObjects = nasaData.near_earth_objects;

        for (const date in nearEarthObjects) {
            for (const neo of nearEarthObjects[date]) {
                const savedNeo = await nasaService.updateAsteroidData(neo);
                processedAsteroids.push(savedNeo);
            }
        }

        res.json({
            element_count: nasaData.element_count,
            near_earth_objects: processedAsteroids
        });
    } catch (error) {
        console.error('[Asteroid Route] Feed Error:', error);
        res.status(500).json({ message: 'Error fetching asteroid feed', error });
    }
});

// Get Single Asteroid
router.get('/:id', async (req, res) => {
    try {
        let asteroid: IAsteroid | null = await Asteroid.findOne({ nasaId: req.params.id });

        // If not found or stale (> 24 hours), fetch from NASA
        const isStale = asteroid ? (new Date().getTime() - asteroid.lastUpdated.getTime()) > 86400000 : true;

        if (!asteroid || isStale) {
            try {
                const nasaData = await nasaService.fetchNeoLookup(req.params.id);
                asteroid = await nasaService.updateAsteroidData(nasaData);
            } catch (e) {
                // If NASA fails, return DB version if exists
                if (!asteroid) throw e;
            }
        }

        res.json(asteroid);
    } catch (error) {
        res.status(404).json({ message: 'Asteroid not found' });
    }
});

export default router;
