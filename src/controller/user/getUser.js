import { handleError } from '../../utils'
import { getUserInfo } from './helpers/getUserInfo'

/**
 * get user information
 */
export const getUser = async(req, res) => {
  try {
    const user = await getUserInfo(req.user.id)
    res.status(200).json(user)
  } catch (error) {
    handleError(res, error)
  }
}
