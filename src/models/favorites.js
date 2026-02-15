import { getDb } from '../config/mongo.js';
import { ObjectId } from 'mongodb';

/**
 * Add a space to user's favorites
 */
export async function addFavorite(userId, spaceId) {
  const db = getDb();
  
  // Check if already in favorites
  const user = await db.collection('users').findOne({ 
    _id: new ObjectId(userId) 
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  // Check if already exists
  const favourites = user.favourites || [];
  const alreadyExists = favourites.some(
    fav => fav.toString() === spaceId.toString()
  );
  
  if (alreadyExists) {
    return { alreadyExists: true, favourites };
  }
  
  // Add to favorites array
  const result = await db.collection('users').findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $addToSet: { favourites: new ObjectId(spaceId) } },
    { returnDocument: 'after' }
  );
  
  return { alreadyExists: false, favourites: result.favourites || [] };
}

/**
 * Remove a space from user's favorites
 */
export async function removeFavorite(userId, spaceId) {
  const db = getDb();
  
  const result = await db.collection('users').findOneAndUpdate(
    { _id: new ObjectId(userId) },
    { $pull: { favourites: new ObjectId(spaceId) } },
    { returnDocument: 'after' }
  );
  
  return result ? (result.favourites || []) : [];
}

/**
 * Get all favorite spaces for a user with full space details
 */
export async function getFavorites(userId) {
  const db = getDb();
  
  // Get user's favorite space IDs
  const user = await db.collection('users').findOne(
    { _id: new ObjectId(userId) },
    { projection: { favourites: 1 } }
  );
  
  if (!user || !user.favourites || user.favourites.length === 0) {
    return [];
  }
  
  // Get full details for each favorite space
  const spaces = await db.collection('spaces')
    .find({ _id: { $in: user.favourites } })
    .toArray();
  
  return spaces;
}