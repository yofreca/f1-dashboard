import Team from '../models/Team.js';

export const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.getAll();
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTeamById = async (req, res) => {
    try {
        const team = await Team.getById(req.params.id);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }
        res.json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTeamWithDrivers = async (req, res) => {
    try {
        const team = await Team.getWithDrivers(req.params.id);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }
        res.json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
