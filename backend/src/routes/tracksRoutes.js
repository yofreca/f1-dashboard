import { Router } from 'express';
import {
    getAllTracks,
    getTrackById,
    getRandomTrack
} from '../controllers/tracksController.js';

const router = Router();

router.get('/', getAllTracks);
router.get('/random', getRandomTrack);
router.get('/:id', getTrackById);

export default router;
