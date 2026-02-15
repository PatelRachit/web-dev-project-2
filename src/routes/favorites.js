import express from 'express';
import passport from 'passport';
import * as favoriteController from '../controller/favorites/index.js';

const requireAuth = passport.authenticate('jwt', { session: false });

const router = express.Router();

// All routes require authentication
router.use(requireAuth);

// Add a space to favorites
router.post('/add', favoriteController.addFavorite);

// Remove a space from favorites
router.delete('/remove/:spaceId', favoriteController.removeFavorite);

// Get all favorite spaces
router.get('/', favoriteController.getFavorites);

export default router;