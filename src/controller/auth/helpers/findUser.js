import { ERROR_CODE } from '../../../constant/index.js'
import User from '../../../models/user.js'
import { itemNotFound } from '../../../utils/index.js           '

const { NOT_FOUND } = ERROR_CODE

/**
 * Finds user by email
 */
export const findUser = async (email = '') => {
  const item = await User.findOne({ email })
  await itemNotFound(null, item, NOT_FOUND)
  return item
}
