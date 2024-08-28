import { check } from 'express-validator'

const create = [
  check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('credits').exists().isInt({ min: 1 }).toInt(),
  check('description').optional({ nullable: true, checkFalsy: true }).isString().trim(),
  check('hasTrimesters').exists().isBoolean().toBoolean(),
  check('status').not().exists(),
  check('userId').not().exists(),
  check('years').exists().isInt({ min: 1 }).toInt(),
]

const update = [
  check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('credits').exists().isInt({ min: 1 }).toInt(),
  check('description').optional({ nullable: true, checkFalsy: true }).isString().trim(),
  check('hasTrimesters').exists().isBoolean().toBoolean(),
  check('status').not().exists(),
  check('userId').not().exists(),
  check('years').exists().isInt({ min: 1 }).toInt(),
]
    
export { create, update }