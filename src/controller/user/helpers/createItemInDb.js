import User from '../../../models/user.js'
import { buildErrObject } from '../../../utils/buildErrObject.js'

/**
 * Creates a new item in database
 */
const createItemInDb = async (userData) => {
  try {
    const user = new User({
      ...userData,
    })

    let item = await user.save()

    item = item.toObject()
    delete item.password

    return item
  } catch (err) {
    throw buildErrObject(422, err.message)
  }
}

export { createItemInDb }
