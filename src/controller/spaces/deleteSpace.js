import * as Spaces from '../../models/spaces.js';

/**
 * DELETE /api/spaces/:id
 * Delete a space (Admin only)
 */
export async function deleteSpace(req, res) {
  try {
    const { id } = req.params;
    
    const deleted = await Spaces.deleteSpace(id);
    
    if (!deleted) {
      return res.status(404).json({ 
        success: false,
        error: 'Space not found' 
      });
    }
    
    res.json({ 
      success: true,
      message: 'Space deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting space:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete space' 
    });
  }
}