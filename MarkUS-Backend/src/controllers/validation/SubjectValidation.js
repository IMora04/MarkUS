import { check } from 'express-validator'
import { Course } from '../../models/models.js'

const checkCourseExists = async (value, { req }) => {
    try {
      const course = await Course.findByPk(req.body.courseId)
      if (!course) {
        return Promise.reject(new Error('The course does not exist.'))
      } else { return Promise.resolve() }
    } catch (err) {
      return Promise.reject(new Error(err))
    }
  }  

const create = [
  check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('shortName').exists().isString().isLength({ min: 1, max: 10 }).trim(),
  check('isAnual').exists().isBoolean().toBoolean(),
  check('secondSemester').exists().isBoolean().toBoolean(),
  check('credits').exists().isInt({ min: 1 }).toInt(),
  check('userId').not().exists(),
  check('courseId').exists().isInt({ min: 1 }).toInt(),
  check('courseId').custom(checkCourseExists),
]

const update = [
]
    
export { create, update }