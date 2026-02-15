import { getDb } from '../../config/mongo.js'
import { ERROR_CODE, STATUS_CODE } from '../../constant/index.js'
import { buildErrObject, handleError } from '../../utils/index.js'

/**
 * Check for the basic auth
 */
export const checkBasicAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    res.setHeader('WWW-Authenticate', 'Basic')
    return handleError(
      res,
      buildErrObject(STATUS_CODE.UNAUTHORIZED, ERROR_CODE.UNAUTHORIZED),
    )
  }

  const b64auth = (req.headers.authorization || '').split(' ')[1] || ''
  const [username, password] = Buffer.from(b64auth, 'base64')
    .toString()
    .split(':')

  const db = getDb()
  const adminCollection = db.collection('super_admin')
  const adminCreds = await adminCollection.find({}).toArray()

  if (
    !username ||
    !password ||
    username !== adminCreds[0].username ||
    password !== adminCreds[0].password
  ) {
    return handleError(
      res,
      buildErrObject(STATUS_CODE.UNAUTHORIZED, ERROR_CODE.UNAUTHORIZED),
    )
  }

  return next()
}
