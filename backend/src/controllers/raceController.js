import Race from '../models/Race.js';

export const getRaceState = (req, res) => {
    try {
        const raceEngine = req.app.get('raceEngine');
        res.json(raceEngine.getState());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const startRace = (req, res) => {
    try {
        const { trackId } = req.body;
        const raceEngine = req.app.get('raceEngine');
        raceEngine.start(trackId);
        res.json({ message: 'Race started', state: raceEngine.getState() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const pauseRace = (req, res) => {
    try {
        const raceEngine = req.app.get('raceEngine');
        raceEngine.pause();
        res.json({ message: 'Race paused', state: raceEngine.getState() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const resumeRace = (req, res) => {
    try {
        const raceEngine = req.app.get('raceEngine');
        raceEngine.resume();
        res.json({ message: 'Race resumed', state: raceEngine.getState() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const stopRace = (req, res) => {
    try {
        const raceEngine = req.app.get('raceEngine');
        raceEngine.stop();
        res.json({ message: 'Race stopped', state: raceEngine.getState() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const resetRace = (req, res) => {
    try {
        const raceEngine = req.app.get('raceEngine');
        raceEngine.reset();
        res.json({ message: 'Race reset', state: raceEngine.getState() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const setWeather = (req, res) => {
    try {
        const { weather } = req.body;
        const raceEngine = req.app.get('raceEngine');
        raceEngine.setWeather(weather);
        res.json({ message: `Weather set to ${weather}`, state: raceEngine.getState() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const setSpeed = (req, res) => {
    try {
        const { speed } = req.body;
        const raceEngine = req.app.get('raceEngine');
        raceEngine.setSpeed(speed);
        res.json({ message: `Speed set to ${speed}x`, state: raceEngine.getState() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRaceHistory = (req, res) => {
    try {
        const races = Race.getAll();
        res.json(races);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
