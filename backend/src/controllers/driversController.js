import Driver from '../models/Driver.js';

export const getAllDrivers = async (req, res) => {
    try {
        const drivers = await Driver.getAll();
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDriverById = async (req, res) => {
    try {
        const driver = await Driver.getById(req.params.id);
        if (!driver) {
            return res.status(404).json({ error: 'Driver not found' });
        }
        res.json(driver);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDriverByAbbreviation = async (req, res) => {
    try {
        const driver = await Driver.getByAbbreviation(req.params.abbr);
        if (!driver) {
            return res.status(404).json({ error: 'Driver not found' });
        }
        res.json(driver);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
