import express from 'express'
import * as spaceController from '../controller/spaces/index.js'
import passport from 'passport'
import { checkAdminAccess } from '../middleware/auth/checkAdminAccess.js'

const router = express.Router()
const requireAuth = passport.authenticate('jwt', { session: false })

// Public routes - anyone can view spaces
router.get('/', spaceController.getAllSpaces)
router.get('/:id', spaceController.getSpaceById)

// Admin routes - for creating/updating/deleting spaces
router.post('/', requireAuth, checkAdminAccess, spaceController.createSpace)
router.put('/:id', requireAuth, checkAdminAccess, spaceController.updateSpace)
router.delete(
  '/:id',
  requireAuth,
  checkAdminAccess,
  spaceController.deleteSpace,
)

export default router
