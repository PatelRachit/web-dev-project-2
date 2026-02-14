import express from 'express';
import * as spaceController from '../controller/spaces/index.js';

const router = express.Router();

// Public routes - anyone can view spaces
router.get('/', spaceController.getAllSpaces);
router.get('/:id', spaceController.getSpaceById);

// Admin routes - for creating/updating/deleting spaces
router.post('/', spaceController.createSpace);
router.put('/:id', spaceController.updateSpace);
router.delete('/:id', spaceController.deleteSpace);

export default router;