import Track from '../models/Track.js';

export const getAllTracks = async (req, res) => {
    try {
        const tracks = await Track.getAll();
        res.json(tracks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTrackById = async (req, res) => {
    try {
        const track = await Track.getById(req.params.id);
        if (!track) {
            return res.status(404).json({ error: 'Track not found' });
        }
        res.json(track);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getRandomTrack = async (req, res) => {
    try {
        const track = await Track.getRandom();
        res.json(track);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
