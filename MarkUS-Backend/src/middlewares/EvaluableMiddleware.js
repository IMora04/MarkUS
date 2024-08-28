import { EvaluableType, Subject } from '../models/models.js'

const checkSubjectOwnership = async (req, res, next) => {
  try {
    const subject = await Subject.findByPk(req.body.subjectId)
    if (req.user.id === subject.userId) {
      return next()
    }
    return res.status(403).send('Not enough privileges. This entity does not belong to you')
  } catch (err) {
    return res.status(500).send(err)
  }
}

const checkEvaluableTypeOwnership = async (req, res, next) => {
  try {
    const evaluableType = await EvaluableType.findByPk(req.body.evaluableTypeId)
    if (req.user.id === evaluableType.userId) {
      return next()
    }
    return res.status(403).send('Not enough privileges. This entity does not belong to you')
  } catch (err) {
    return res.status(500).send(err)
  }
}

export { checkSubjectOwnership, checkEvaluableTypeOwnership }
