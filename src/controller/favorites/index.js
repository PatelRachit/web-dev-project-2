import * as Favorites from '../../models/favorites.js';

export async function addFavorite(req, res) {
  try {
    const { spaceId } = req.body;
    const userId = req.user._id; 
    
    if (!spaceId) {
      return res.status(400).json({ 
        success: false,
        error: 'spaceId is required' 
      });
    }
    
    const result = await Favorites.addFavorite(userId, spaceId);
    
    if (result.alreadyExists) {
      return res.status(200).json({ 
        success: true,
        message: 'Space already in favorites',
        favourites: result.favourites 
      });
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Added to favorites',
      favourites: result.favourites 
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to add favorite' 
    });
  }
}

export async function removeFavorite(req, res) {
  try {
    const { spaceId } = req.params;
    const userId = req.user._id;
    
    const favourites = await Favorites.removeFavorite(userId, spaceId);
    
    res.json({ 
      success: true,
      message: 'Removed from favorites',
      favourites 
    });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to remove favorite' 
    });
  }
}

export async function getFavorites(req, res) {
  try {
    const userId = req.user._id;
    
    const favourites = await Favorites.getFavorites(userId);
    
    res.json({ 
      success: true,
      favourites 
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch favorites' 
    });
  }
}