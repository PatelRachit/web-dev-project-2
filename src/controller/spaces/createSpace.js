import * as Spaces from '../../models/spaces.js'

export async function createSpace(req, res) {
  try {
    const spaceData = req.body

    if (!spaceData.name || !spaceData.building || !spaceData.capacity) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, building, capacity',
      })
    }

    const space = await Spaces.createSpace(spaceData)

    res.status(201).json({
      success: true,
      space,
    })
  } catch (error) {
    console.error('Error creating space:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create space',
    })
  }
}
