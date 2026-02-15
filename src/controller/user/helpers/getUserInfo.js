import { ObjectId } from 'mongodb'
import { getDb } from '../../../config/index.js'
import { itemNotFound } from '../../../utils/itemNotFound.js'
import { ERROR_CODE } from '../../../constant/index.js'

const { NOT_FOUND } = ERROR_CODE

export const getUserInfo = async (userId) => {
  const db = getDb()
  const usersCollection = db.collection('users')

  const user = await usersCollection.findOne(
    { _id: new ObjectId(userId) },
    {
      projection: {
        password: 0,
      },
    },
  )

  await itemNotFound(null, user, NOT_FOUND)
  return user
}
