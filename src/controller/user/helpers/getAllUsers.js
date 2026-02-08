import { STATUS_CODE } from '../../../constant/index.js'
import user from '../../../models/user.js'
import { buildErrObject } from '../../../utils/index.js'

export const getAllUsers = async () => {
  try {
    return await user.find({}).select('-password')
  } catch (err) {
    throw buildErrObject(STATUS_CODE.UNPROCESSABLE, err.message)
  }
}
