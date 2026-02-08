import { matchedData } from 'express-validator'
import { ERROR_CODE, STATUS_CODE } from '../../constant/index.js'
import { checkPassword } from '../../middleware/auth/checkPassword.js'
import { buildErrObject, handleError } from '../../utils/index.js'
import { findUser, returnRegisterToken, setUserInfo } from './helpers/index.js'

const { WRONG_PASSWORD, DISABLED_ACCOUNT } = ERROR_CODE

const login = async (req, res) => {
  try {
    const data = matchedData(req)
    const user = await findUser(data.email)
    if (user.isActive) {
      const isPasswordMatch = await checkPassword(data.password, user)
      if (!isPasswordMatch) {
        handleError(res, buildErrObject(STATUS_CODE.CONFLICT, WRONG_PASSWORD))
      } else {
        // all ok, return token and response
        const userInfo = await setUserInfo(user)
        const response = await returnRegisterToken(user, userInfo)
        res
          .cookie('authToken', response.token, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
          })
          .status(STATUS_CODE.SUCCESS)
          .json(response)
      }
    } else {
      handleError(
        res,
        buildErrObject(STATUS_CODE.UNAUTHORIZED, DISABLED_ACCOUNT),
      )
    }
  } catch (error) {
    handleError(res, error)
  }
}

export { login }
