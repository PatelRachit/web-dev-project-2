import { STATUS_CODE } from '../../constant/statusCode.js'
import * as Spaces from '../../models/spaces.js'
import { handleError } from '../../utils/handleError.js'

export async function getAllSpaces(req, res) {
  try {
    const filters = {}

    if (req.query.category) {
      filters.category = req.query.category
    }

    if (req.query.building) {
      filters.building = req.query.building
    }

    if (req.query.amenities) {
      filters.amenities = req.query.amenities.split(',').map((a) => a.trim())
    }

    if (req.query.search) {
      filters.search = req.query.search
    }

    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const { spaces, total } = await Spaces.getAllSpaces(filters, {
      skip,
      limit,
    })

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
