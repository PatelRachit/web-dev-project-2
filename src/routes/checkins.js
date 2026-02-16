import express from 'express';
import passport from 'passport';
import * as checkInController from '../controller/checkins/index.js';

const requireAuth = passport.authenticate('jwt', { session: false });

const router = express.Router();

router.post('/checkin', requireAuth, checkInController.checkIn);
router.post('/checkout', requireAuth, checkInController.checkOut);
router.get('/my-checkins', requireAuth, checkInController.getMyCheckIns);
router.get('/active', requireAuth, checkInController.getActiveCheckIn);
router.get('/space/:spaceId', checkInController.getSpaceCheckIns);

export default router;