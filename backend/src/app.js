import express from 'express';
import cors from 'cors';
import driversRoutes from './routes/driversRoutes.js';
import teamsRoutes from './routes/teamsRoutes.js';
import tracksRoutes from './routes/tracksRoutes.js';
import raceRoutes from './routes/raceRoutes.js';

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/drivers', driversRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/tracks', tracksRoutes);
app.use('/api/race', raceRoutes);

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

export default app;
