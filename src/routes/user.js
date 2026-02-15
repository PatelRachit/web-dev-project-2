import express from 'express'
import trimRequest from 'trim-request'
import {
  createUser,
  getUsers,
  getUser,
  updateUser,
} from '../controller/user/index.js'
import { validateCreateUser } from '../controller/user/validators/validateCreateUser.js'
import passport from 'passport'
import { validateUpdateUser } from '../controller/user/validators/validateUpadteUser.js'

const router = express.Router()

const requieAuth = passport.authenticate('jwt', { session: false })

router.get('/', trimRequest.all, getUsers)
router.post('/', trimRequest.all, validateCreateUser, createUser)

router.get('/info', requieAuth, trimRequest.all, getUser)
router.patch(
  '/info',
  requieAuth,
  trimRequest.all,
  validateUpdateUser,
  updateUser,
)

export default router
