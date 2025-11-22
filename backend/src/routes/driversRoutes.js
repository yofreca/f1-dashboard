import { Router } from 'express';
import {
    getAllDrivers,
    getDriverById,
    getDriverByAbbreviation
} from '../controllers/driversController.js';

const router = Router();

router.get('/', getAllDrivers);
router.get('/:id', getDriverById);
router.get('/abbr/:abbr', getDriverByAbbreviation);

export default router;
