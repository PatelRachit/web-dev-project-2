import { matchedData } from 'express-validator'
import { handleError } from '../../utils/index.js'
import { updateUserDetails } from './helpers/updateUserDetails.js'
import { STATUS_CODE } from '../../constant/index.js'

/**
 * update the user info
 */
export const updateUser = async (req, res) => {
  try {
    const userData = matchedData(req)
    const { _id } = req.user
    const updatedUser = await updateUserDetails(_id, userData)
    res.status(STATUS_CODE.SUCCESS).json(updatedUser)
  } catch (error) {
    handleError(res, error)
  }
}
