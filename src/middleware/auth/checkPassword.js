import { buildErrObject } from '../../utils/buildErrObject.js'

const checkPassword = async (password, user) => {
  try {
    const isMatch = await user.comparePassword(password)
    return isMatch
  } catch (error) {
    throw buildErrObject(422, error.message)
  }
}
export { checkPassword }
