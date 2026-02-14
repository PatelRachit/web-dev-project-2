import * as Spaces from '../../models/spaces.js';

/**
 * GET /api/spaces
 * Get all spaces with optional filters
 */
export async function getAllSpaces(req, res) {
  try {
    const filters = {};
    
    // Parse query params
    if (req.query.category) {
      filters.category = req.query.category;
    }
    
    if (req.query.building) {
      filters.building = req.query.building;
    }
    
    if (req.query.amenities) {
      filters.amenities = req.query.amenities.split(',').map(a => a.trim());
    }
    
    const spaces = await Spaces.getAllSpaces(filters);
    
    res.json({ 
      success: true,
      spaces 
    });
  } catch (error) {
    console.error('Error fetching spaces:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch spaces' 
    });
  }
}