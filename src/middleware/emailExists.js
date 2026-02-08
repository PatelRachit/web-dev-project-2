import { ERROR_CODE } from '../constant/errorCode.js'
import User from '../models/user.js'
import { buildErrObject } from '../utils/buildErrObject.js'

const { EMAIL_ALREADY_EXISTS } = ERROR_CODE

const emailExists = async (email) => {
  try {
    const item = await User.findOne({ email })

    if (item) {
      console.log(item)
      throw buildErrObject(422, EMAIL_ALREADY_EXISTS)
    }

    return false
  } catch (err) {
    // If it's already a built error object, throw it as is
    if (err.code && err.message) {
      throw err
    }
    // Otherwise, it's a database error
    throw buildErrObject(422, err.message)
  }
}

export { emailExists }
