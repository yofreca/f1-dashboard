import { Router } from 'express';
import {
    getAllTeams,
    getTeamById,
    getTeamWithDrivers
} from '../controllers/teamsController.js';

const router = Router();

router.get('/', getAllTeams);
router.get('/:id', getTeamById);
router.get('/:id/drivers', getTeamWithDrivers);

export default router;
