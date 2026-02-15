import { STATUS_CODE } from '../../constant/statusCode.js'
import * as Spaces from '../../models/spaces.js'
import { handleError } from '../../utils/handleError.js'

/**
 * GET /api/spaces
 * Get all spaces with optional filters and pagination
 */
export async function getAllSpaces(req, res) {
  try {
    const filters = {}

    // Parse query params for filters
    if (req.query.category) {
      filters.category = req.query.category
    }

    if (req.query.building) {
      filters.building = req.query.building
    }

    if (req.query.amenities) {
      filters.amenities = req.query.amenities.split(',').map((a) => a.trim())
    }

    // Pagination parameters
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    // Get spaces with pagination
    const { spaces, total } = await Spaces.getAllSpaces(filters, {
      skip,
      limit,
    })

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit)
    const hasNextPage = page < totalPages
    const hasPrevPage = page > 1

    res.status(STATUS_CODE.SUCCESS).json({
      data: spaces,
      pagination: {
        currentPage: page,
        totalPages,
        totalSpaces: total,
        limit,
        hasNextPage,
        hasPrevPage,
      },
    })
  } catch (error) {
    handleError(res, error)
  }
}
