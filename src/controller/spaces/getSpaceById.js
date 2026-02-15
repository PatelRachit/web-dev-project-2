import { STATUS_CODE } from '../../constant/statusCode.js'
import * as Spaces from '../../models/spaces.js'
import { handleError } from '../../utils/handleError.js'

export async function getSpaceById(req, res) {
  try {
    const { id } = req.params

    const space = await Spaces.getSpaceById(id)

    if (!space) {
      return res.status(404).json({
        success: false,
        error: 'Space not found',
      })
    }

    // Get current check-ins for this space
    const currentCheckIns = await Spaces.getCurrentCheckIns(id)

    res.status(STATUS_CODE.SUCCESS).json({
      space,
      currentCheckIns,
    })
  } catch (error) {
    handleError(res, error)
  }
}
