import * as Spaces from '../../models/spaces.js';

/**
 * PUT /api/spaces/:id
 * Update a space (Admin only)
 */
export async function updateSpace(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Don't allow updating _id or createdAt
    delete updates._id;
    delete updates.createdAt;
    
    const space = await Spaces.updateSpace(id, updates);
    
    if (!space) {
      return res.status(404).json({ 
        success: false,
        error: 'Space not found' 
      });
    }
    
    res.json({ 
      success: true,
      space 
    });
  } catch (error) {
    console.error('Error updating space:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to update space' 
    });
  }
}