import { ObjectId } from 'mongodb'
import { getDb } from '../../../config/index.js'

export const updateUserDetails = async (id, userData) => {
  const userCollection = getDb().collection('users')

  const result = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: {
        name: userData.name,
        major: userData.major,
        graduationYear: userData.graduationYear,
        updatedAt: new Date(),
      },
    },
    {
      returnDocument: 'after',
      projection: { password: 0 },
    },
  )

  return result
}
