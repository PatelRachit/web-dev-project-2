import { ERROR_CODE } from '../../../constant/index.js'
import User from '../../../models/user.js'
import { itemNotFound } from '../../../utils/index.js'

const { NOT_FOUND } = ERROR_CODE

/**
 * Finds user by ID
 */
export const findUserById = async (userId) => {
  const user = await User.findById(
    userId,
    '-verified -createdAt -updatedAt -tableConfig -verification -password',
  ).lean()
  await itemNotFound(null, user, NOT_FOUND)
  return user
}
