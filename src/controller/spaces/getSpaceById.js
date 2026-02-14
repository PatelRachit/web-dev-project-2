import * as Spaces from '../../models/spaces.js';

/**
 * GET /api/spaces/:id
 * Get a single space by ID with current check-ins
 */
export async function getSpaceById(req, res) {
  try {
    const { id } = req.params;
    
    const space = await Spaces.getSpaceById(id);
    
    if (!space) {
      return res.status(404).json({ 
        success: false,
        error: 'Space not found' 
      });
    }
    
    // Get current check-ins for this space
    const currentCheckIns = await Spaces.getCurrentCheckIns(id);
    
    res.json({ 
      success: true,
      space,
      currentCheckIns 
    });
  } catch (error) {
    console.error('Error fetching space:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch space' 
    });
  }
}