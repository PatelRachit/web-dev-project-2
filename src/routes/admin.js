import express from 'express'
import trimRequest from 'trim-request'
import { createAdmin } from '../controller/admin/index.js'
import { checkBasicAuth } from '../middleware/auth/checkBasicAuth.js'
import { validateCreateAdmin } from '../controller/admin/validators/validateCreateAdmin.js'

const router = express.Router()

router.post(
  '/',
  checkBasicAuth,
  trimRequest.all,
  validateCreateAdmin,
  createAdmin,
)

export default router
