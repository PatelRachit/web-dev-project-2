// src/models/spaces.js
import { getDB } from '../config/mongo.js';
import { ObjectId } from 'mongodb';

/**
 * Get all spaces with optional filters
 */
export async function getAllSpaces(filters = {}) {
  const db = getDB();
  const query = {};
  
  if (filters.category) {
    query.category = filters.category;
  }
  
  if (filters.building) {
    query.building = filters.building;
  }
  
  if (filters.amenities && filters.amenities.length > 0) {
    query.amenities = { $all: filters.amenities };
  }
  
  return await db.collection('spaces').find(query).toArray();
}

/**
 * Get a single space by ID
 */
export async function getSpaceById(id) {
  const db = getDB();
  return await db.collection('spaces').findOne({ _id: new ObjectId(id) });
}

/**
 * Create a new space
 */
export async function createSpace(spaceData) {
  const db = getDB();
  
  const space = {
    ...spaceData,
    currentOccupancy: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  const result = await db.collection('spaces').insertOne(space);
  return { ...space, _id: result.insertedId };
}

/**
 * Update a space
 */
export async function updateSpace(id, updates) {
  const db = getDB();
  
  const result = await db.collection('spaces').findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...updates, updatedAt: new Date() } },
    { returnDocument: 'after' }
  );
  
  return result;
}

/**
 * Delete a space
 */
export async function deleteSpace(id) {
  const db = getDB();
  const result = await db.collection('spaces').deleteOne({ 
    _id: new ObjectId(id) 
  });
  
  return result.deletedCount > 0;
}

/**
 * Get current check-ins for a space
 */
export async function getCurrentCheckIns(spaceId) {
  const db = getDB();
  return await db.collection('checkins')
    .find({ 
      spaceId: new ObjectId(spaceId), 
      isActive: true 
    })
    .toArray();
}