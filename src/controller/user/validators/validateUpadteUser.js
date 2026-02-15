import { check } from 'express-validator'
import { ERROR_CODE } from '../../../constant/index.js'
import { validateResult } from '../../../utils/validateResult.js'

const { MISSING, IS_EMPTY } = ERROR_CODE

/**
 * Validates register request
 */
const validateUpdateUser = [
  check('name')
    .exists()
    .withMessage(MISSING)
    .not()
    .isEmpty()
    .withMessage(IS_EMPTY)
    .trim()
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage('NAME_MUST_CONTAIN_ONLY_LETTERS'),
  check('major')
    .exists()
    .withMessage(MISSING)
    .not()
    .isEmpty()
    .withMessage(IS_EMPTY)
    .trim(),
  check('graduationYear')
    .exists()
    .withMessage(MISSING)
    .not()
    .isEmpty()
    .withMessage(IS_EMPTY)
    .isNumeric()
    .withMessage('GRADUATION_YEAR_MUST_BE_NUMERIC'),
  (req, res, next) => {
    validateResult(req, res, next)
  },
]

export { validateUpdateUser }
