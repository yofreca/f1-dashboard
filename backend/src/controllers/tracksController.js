import Track from '../models/Track.js';

export const getAllTracks = (req, res) => {
    try {
        const tracks = Track.getAll();
        res.json(tracks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTrackById = (req, res) => {
    try {
        const track = Track.getById(req.params.id);
        if (!track) {
            return res.status(404).json({ error: 'Track not found' });
        }
        res.json(track);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRandomTrack = (req, res) => {
    try {
        const track = Track.getRandom();
        res.json(track);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
