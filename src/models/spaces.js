// src/models/spaces.js
import { getDb } from '../config/mongo.js'
import { ObjectId } from 'mongodb'

/**
 * Get all spaces with filters and pagination
 */
export async function getAllSpaces(filters = {}, options = {}) {
  const db = getDb()
  const spacesCollection = db.collection('spaces')

  // Build query
  const query = {}

  if (filters.category) {
    query.category = filters.category
  }

  if (filters.building) {
    query.building = filters.building
  }

  if (filters.amenities && filters.amenities.length > 0) {
    query.amenities = { $all: filters.amenities }
  }

  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: 'i' } },
      { building: { $regex: filters.search, $options: 'i' } },
      { category: { $regex: filters.search, $options: 'i' } },
    ]
  }

  // Get total count for pagination
  const total = await spacesCollection.countDocuments(query)

  // Get paginated results
  const spaces = await spacesCollection
    .find(query)
    .skip(options.skip || 0)
    .limit(options.limit || 20)
    .toArray()

  return { spaces, total }
}

/**
 * Get a single space by ID
 */
export async function getSpaceById(id) {
  const db = getDb()
  return await db.collection('spaces').findOne({ _id: new ObjectId(id) })
}

/**
 * Create a new space
 */
export async function createSpace(spaceData) {
  const db = getDb()

  const space = {
    ...spaceData,
    currentOccupancy: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await db.collection('spaces').insertOne(space)
  return { ...space, _id: result.insertedId }
}

/**
 * Update a space
 */
export async function updateSpace(id, updates) {
  const db = getDb()

  const result = await db
    .collection('spaces')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: 'after' },
    )

  return result
}

/**
 * Delete a space
 */
export async function deleteSpace(id) {
  const db = getDb()
  const result = await db.collection('spaces').deleteOne({
    _id: new ObjectId(id),
  })

  return result.deletedCount > 0
}

/**
 * Get current check-ins for a space
 */
export async function getCurrentCheckIns(spaceId) {
  const db = getDb()
  return await db
    .collection('checkins')
    .find({
      spaceId: new ObjectId(spaceId),
      isActive: true,
    })
    .toArray()
}
