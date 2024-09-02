import { check } from 'express-validator'
import { Evaluable, EvaluableType, Studies, Subject } from '../../models/models.js'

const checkSubjectExists = async (value, { req }) => {
  try {
    const subject = await Subject.findByPk(req.body.subjectId)
    if (!subject) {
      return Promise.reject(new Error('The subject does not exist.'))
    } else { return Promise.resolve() }
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}  

const checkTypeExists = async (value, { req }) => {
    try {
      const evaluableType = await EvaluableType.findByPk(req.body.evaluableTypeId)
      if (!evaluableType) {
        return Promise.reject(new Error('The evaluable type does not exist.'))
      } else { return Promise.resolve() }
    } catch (err) {
      return Promise.reject(new Error(err))
    }
  }    

const checkPreviousSubject =  async (value, { req }) => {
  try {
    const updatingEvaluable = await Evaluable.findByPk(req.params.evaluableId)
    if (updatingEvaluable.subjectId !== req.body.subjectId) {
      return Promise.reject(new Error('You cannot change the subject.'))
    } else { return Promise.resolve() }
  } catch (err) {
    return Promise.reject(new Error(err))
  }
}

const create = [
  check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('mark').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }).toFloat(),
  check('weight').exists().isFloat({ min: 0 }).toFloat(),
  check('subjectId').exists().isInt({ min: 1 }).toInt(),
  check('subjectId').custom(checkSubjectExists),
  check('evaluableTypeId').exists().isInt({ min: 1 }).toInt(),
  check('evaluableTypeId').custom(checkTypeExists),
  check('userId').not().exists(),
]

const update = [
  check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('mark').optional({ nullable: true, checkFalsy: true }).isFloat({ min: 0 }).toFloat(),
  check('weight').exists().isFloat({ min: 0 }).toFloat(),
  check('subjectId').exists().isInt({ min: 1 }).toInt(),
  check('subjectId').custom(checkPreviousSubject),
  check('evaluableTypeId').exists().isInt({ min: 1 }).toInt(),
  check('evaluableTypeId').custom(checkTypeExists),
  check('userId').not().exists(),
]

const createType = [
  check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('userId').not().exists(),
]

    
export { create, update, createType }
