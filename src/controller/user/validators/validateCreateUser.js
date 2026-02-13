import { check } from 'express-validator'
import { ERROR_CODE, PASSWORD_REGEX } from '../../../constant/index.js'
import { validateResult } from '../../../utils/validateResult.js'

const { MISSING, IS_EMPTY, EMAIL_IS_NOT_VALID, INVALID_PASSWORD_FORMAT } =
  ERROR_CODE

/**
 * Validates register request
 */
const validateCreateUser = [
  check('name')
    .exists()
    .withMessage(MISSING)
    .not()
    .isEmpty()
    .withMessage(IS_EMPTY)
    .trim(),
  check('email')
    .exists()
    .withMessage(MISSING)
    .not()
    .isEmpty()
    .withMessage(IS_EMPTY)
    .isEmail()
    .withMessage(EMAIL_IS_NOT_VALID)
    .normalizeEmail(),
  check('password')
    .exists()
    .withMessage(MISSING)
    .not()
    .isEmpty()
    .withMessage(IS_EMPTY)
    .matches(PASSWORD_REGEX)
    .withMessage(INVALID_PASSWORD_FORMAT),
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

export { validateCreateUser }
