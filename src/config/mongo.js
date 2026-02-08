import mongoose from 'mongoose'

export default async function initMongo() {
  try {
    let dbStatus
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI, {})
      dbStatus = '*    DB Connection: OK\n****************************\n'
    } else {
      console.log('+++++++++++++++++-=object')
      dbStatus =
        '*    DB Connection: Already Running \n****************************\n'
    }

    // Prints initialization
    console.log('****************************')
    console.log('*    Starting Server')
    console.log('*    Database: MongoDB')
    console.log(dbStatus)
    return mongoose.connection
  } catch (error) {
    console.log('***DB ERROR***')
    console.log({ error })
  }
}
