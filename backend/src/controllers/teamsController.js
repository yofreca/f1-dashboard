import Team from '../models/Team.js';

export const getAllTeams = (req, res) => {
    try {
        const teams = Team.getAll();
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTeamById = (req, res) => {
    try {
        const team = Team.getById(req.params.id);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }
        res.json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getTeamWithDrivers = (req, res) => {
    try {
        const team = Team.getWithDrivers(req.params.id);
        if (!team) {
            return res.status(404).json({ error: 'Team not found' });
        }
        res.json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
