import { matchedData } from 'express-validator'
import { createAdminInDb } from './helpers/createAdminInDb.js'
import { emailExists } from '../../middleware/emailExists.js'
import { STATUS_CODE } from '../../constant/index.js'
import { handleError } from '../../utils/index.js'

/**
 * Creates admin in DB.
 */
export const createAdmin = async (req, res) => {
  try {
    const requestData = matchedData(req)
    const doesEmailExists = await emailExists(requestData.email)
    if (!doesEmailExists) {
      const item = await createAdminInDb(requestData)
      res.status(STATUS_CODE.CREATED).json(item)
    }
  } catch (error) {
    handleError(res, error)
  }
}
