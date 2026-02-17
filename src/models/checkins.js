import { getDb } from '../config/mongo.js'
import { ObjectId } from 'mongodb'

export async function checkIn(userId, spaceId) {
  const db = getDb()

  await autoCheckOut(userId)

  const checkIn = {
    userId: new ObjectId(userId),
    spaceId: new ObjectId(spaceId),
    checkInTime: new Date(),
    checkOutTime: null,
    isActive: true,
  }

  const result = await db.collection('checkins').insertOne(checkIn)

  await db
    .collection('spaces')
    .updateOne(
      { _id: new ObjectId(spaceId) },
      { $inc: { currentOccupancy: 1 } },
    )

  await db.collection('users').updateOne(
    { _id: new ObjectId(userId) },
    {
      $set: { currentlyStudyingAt: new ObjectId(spaceId) },
      $inc: { totalCheckIns: 1 },
    },
  )

  return { ...checkIn, _id: result.insertedId }
}

export async function checkOut(userId) {
  const db = getDb()

  const activeCheckIn = await db.collection('checkins').findOne({
    userId: new ObjectId(userId),
    isActive: true,
  })

  if (!activeCheckIn) {
    return null
  }

  const checkOutTime = new Date()
  const duration = checkOutTime - activeCheckIn.checkInTime // milliseconds

  await db.collection('checkins').updateOne(
    { _id: activeCheckIn._id },
    {
      $set: {
        checkOutTime,
        isActive: false,
        duration,
      },
    },
  )

  await db
    .collection('spaces')
    .updateOne(
      { _id: activeCheckIn.spaceId },
      { $inc: { currentOccupancy: -1 } },
    )

  await db
    .collection('users')
    .updateOne(
      { _id: new ObjectId(userId) },
      { $set: { currentlyStudyingAt: null } },
    )

  return {
    ...activeCheckIn,
    checkOutTime,
    duration,
  }
}

async function autoCheckOut(userId) {
  const db = getDb()

  const activeCheckIn = await db.collection('checkins').findOne({
    userId: new ObjectId(userId),
    isActive: true,
  })

  if (activeCheckIn) {
    await checkOut(userId)
  }
}

export async function getMyCheckIns(userId) {
  const db = getDb()

  const checkIns = await db
    .collection('checkins')
    .find({ userId: new ObjectId(userId) })
    .sort({ checkInTime: -1 })
    .limit(20)
    .toArray()

  return checkIns
}

export async function getActiveCheckIn(userId) {
  const db = getDb()

  const activeCheckIn = await db.collection('checkins').findOne({
    userId: new ObjectId(userId),
    isActive: true,
  })

  if (!activeCheckIn) {
    return null
  }

  const space = await db.collection('spaces').findOne({
    _id: activeCheckIn.spaceId,
  })

  return {
    ...activeCheckIn,
    space,
  }
}

export async function getSpaceCheckIns(spaceId) {
  const db = getDb()

  const checkIns = await db
    .collection('checkins')
    .find({
      spaceId: new ObjectId(spaceId),
      isActive: true,
    })
    .toArray()

  return {
    checkIns,
    currentCount: checkIns.length,
  }
}
