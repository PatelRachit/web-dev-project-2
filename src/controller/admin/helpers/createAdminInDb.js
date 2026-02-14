import { getDb } from '../../../config/mongo.js'
import { hashPassword } from '../../../middleware/auth/hashPassword.js'

/**
 * Creates a new admin in database
 */
export const createAdminInDb = async ({ email, password }) => {
  const usersCollection = getDb().collection('users')

  const newUser = {
    email: email.toLowerCase(),
    password: await hashPassword(password),
    isAdmin: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await usersCollection.insertOne(newUser)
  return await usersCollection.findOne({ _id: result.insertedId })
}
