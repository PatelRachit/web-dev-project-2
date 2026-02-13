import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

const uri = process.env.MONGO_URI
const client = new MongoClient(uri)

export default async function connectDB() {
  try {
    await client.connect()
    console.log('****************************')
    console.log('*    Starting Server')
    console.log('*    Database: MongoDB')
    console.log('****************************')

    client.db('spotcheck')
  } catch (err) {
    console.error('Error connecting to MongoDB:', err)
  } finally {
    await client.close() // close connection after operation
  }
}
