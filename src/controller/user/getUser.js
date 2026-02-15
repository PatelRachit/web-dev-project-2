import { handleError } from '../../utils/index.js'
import { getUserInfo } from './helpers/getUserInfo.js'

/**
 * get user information
 */
export const getUser = async (req, res) => {
  try {
    console.log(req.user)
    const user = await getUserInfo(req.user._id)
    res.status(200).json(user)
  } catch (error) {
    handleError(res, error)
  }
}
