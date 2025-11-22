import Race from '../models/Race.js';

export const getRaceState = async (req, res) => {
    try {
        const raceEngine = req.app.get('raceEngine');
        res.json(raceEngine.getState());
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const startRace = async (req, res) => {
    try {
        const { trackId } = req.body;
        const raceEngine = req.app.get('raceEngine');
        await raceEngine.start(trackId);
        res.json({ message: 'Race started', state: raceEngine.getState() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const pauseRace = async (req, res) => {
    try {
        const raceEngine = req.app.get('raceEngine');
        raceEngine.pause();
        res.json({ message: 'Race paused', state: raceEngine.getState() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const resumeRace = async (req, res) => {
    try {
        const raceEngine = req.app.get('raceEngine');
        raceEngine.resume();
        res.json({ message: 'Race resumed', state: raceEngine.getState() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const stopRace = async (req, res) => {
    try {
        const raceEngine = req.app.get('raceEngine');
        raceEngine.stop();
        res.json({ message: 'Race stopped', state: raceEngine.getState() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const resetRace = async (req, res) => {
    try {
        const raceEngine = req.app.get('raceEngine');
        raceEngine.reset();
        res.json({ message: 'Race reset', state: raceEngine.getState() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const setWeather = async (req, res) => {
    try {
        const { weather } = req.body;
        const raceEngine = req.app.get('raceEngine');
        raceEngine.setWeather(weather);
        res.json({ message: `Weather set to ${weather}`, state: raceEngine.getState() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const setSpeed = async (req, res) => {
    try {
        const { speed } = req.body;
        const raceEngine = req.app.get('raceEngine');
        raceEngine.setSpeed(speed);
        res.json({ message: `Speed set to ${speed}x`, state: raceEngine.getState() });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRaceHistory = async (req, res) => {
    try {
        const races = await Race.getAll();
        res.json(races);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
