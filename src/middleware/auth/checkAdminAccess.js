import { ERROR_CODE, STATUS_CODE } from '../../constant/index.js'

/**
 * Checking for the admin access
 */
export const checkAdminAccess = (req, res, next) => {
  const user = req.user

  if (!user.isAdmin) {
    res.status(STATUS_CODE.UNAUTHORIZED).json(ERROR_CODE.UNAUTHORIZED)
  }

  return next()
}
