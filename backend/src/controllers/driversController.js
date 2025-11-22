import Driver from '../models/Driver.js';

export const getAllDrivers = (req, res) => {
    try {
        const drivers = Driver.getAll();
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDriverById = (req, res) => {
    try {
        const driver = Driver.getById(req.params.id);
        if (!driver) {
            return res.status(404).json({ error: 'Driver not found' });
        }
        res.json(driver);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getDriverByAbbreviation = (req, res) => {
    try {
        const driver = Driver.getByAbbreviation(req.params.abbr);
        if (!driver) {
            return res.status(404).json({ error: 'Driver not found' });
        }
        res.json(driver);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
