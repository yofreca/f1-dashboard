import { Router } from 'express';
import {
    getRaceState,
    startRace,
    pauseRace,
    resumeRace,
    stopRace,
    resetRace,
    setWeather,
    setSpeed,
    getRaceHistory
} from '../controllers/raceController.js';

const router = Router();

router.get('/state', getRaceState);
router.get('/history', getRaceHistory);
router.post('/start', startRace);
router.post('/pause', pauseRace);
router.post('/resume', resumeRace);
router.post('/stop', stopRace);
router.post('/reset', resetRace);
router.post('/weather', setWeather);
router.post('/speed', setSpeed);

export default router;
