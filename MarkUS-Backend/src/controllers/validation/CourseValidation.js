import { check } from 'express-validator'
import { Course, Studies } from '../../models/models.js'

const checkStudiesExists = async (value, { req }) => {
  try {
    const studies = await Studies.findByPk(req.body.studiesId)
    if (!studies) {
      return Promise.reject(new Error('The studiesId does not exist.'))
    } else { return Promise.resolve() }
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}

const checkPreviousStudies = async (value, { req }) => {
  try {
    const updatingCourse = await Course.findByPk(req.params.courseId)
    if (updatingCourse.studiesId !== req.body.studiesId) {
      return Promise.reject(new Error('You cannot change the studies.'))
    } else { return Promise.resolve() }
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}

const checkLessThanStudiesLength = async (value, { req }) => {
  try {
    const number = req.body.number
    const studies = await Studies.findByPk(req.body.studiesId)
    if (number > studies.years) {
      return Promise.reject(new Error('The course number exceeds the number of years of the studies.'))
    } else { return Promise.resolve() }
    } catch (err) {
    return Promise.reject(new Error(err))
  }
}

const create = [
  check('number').exists().isInt({ min: 1 }).toInt(),
  check('number').custom(checkLessThanStudiesLength),
  check('credits').exists().isInt({ min: 1 }).toInt(),
  check('status').not().exists(),
  check('userId').not().exists(),
  check('studiesId').exists().isInt({ min: 1 }).toInt(),
  check('studiesId').custom(checkStudiesExists),
]

const update = [
  check('number').exists().isInt({ min: 1 }).toInt(),
  check('number').custom(checkLessThanStudiesLength),
  check('credits').exists().isInt({ min: 1 }).toInt(),
  check('status').not().exists(),
  check('userId').not().exists(),
  check('studiesId').exists().isInt({ min: 1 }).toInt(),
  check('studiesId').custom(checkPreviousStudies),
]
    
export { create, update }
