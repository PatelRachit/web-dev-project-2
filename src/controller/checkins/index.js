import * as CheckIns from '../../models/checkins.js';

export async function checkIn(req, res) {
  try {
    const { spaceId } = req.body;
    const userId = req.user._id;
    
    if (!spaceId) {
      return res.status(400).json({ 
        success: false,
        error: 'spaceId is required' 
      });
    }
    
    const checkIn = await CheckIns.checkIn(userId, spaceId);
    
    res.status(200).json({ 
      success: true,
      message: 'Checked in successfully',
      checkIn 
    });
  } catch (error) {
    console.error('Error checking in:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to check in' 
    });
  }
}

export async function checkOut(req, res) {
  try {
    const userId = req.user._id;
    
    const result = await CheckIns.checkOut(userId);
    
    if (!result) {
      return res.status(400).json({ 
        success: false,
        error: 'No active check-in found' 
      });
    }
    
    const durationMs = result.duration;
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    const durationString = `${hours} hours ${minutes} minutes`;
    
    res.json({ 
      success: true,
      message: 'Checked out successfully',
      checkIn: result,
      duration: durationString
    });
  } catch (error) {
    console.error('Error checking out:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to check out' 
    });
  }
}

export async function getMyCheckIns(req, res) {
  try {
    const userId = req.user._id;
    
    const checkIns = await CheckIns.getMyCheckIns(userId);
    
    res.json({ 
      success: true,
      checkIns 
    });
  } catch (error) {
    console.error('Error fetching check-ins:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch check-ins' 
    });
  }
}

export async function getActiveCheckIn(req, res) {
  try {
    const userId = req.user._id;
    
    const activeCheckIn = await CheckIns.getActiveCheckIn(userId);
    
    res.json({ 
      success: true,
      activeCheckIn 
    });
  } catch (error) {
    console.error('Error fetching active check-in:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch active check-in' 
    });
  }
}

export async function getSpaceCheckIns(req, res) {
  try {
    const { spaceId } = req.params;
    
    const result = await CheckIns.getSpaceCheckIns(spaceId);
    
    res.json({ 
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching space check-ins:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch space check-ins' 
    });
  }
}