import { Course, Subject } from '../models/models.js'

const checkSubjectOwnership = async (req, res, next) => {
  try {
    const subject = await Subject.findByPk(req.params.subjectId)
    if (req.user.id === subject.userId) {
      return next()
    }
    return res.status(403).send('Not enough privileges. This entity does not belong to you')
  } catch (err) {
    return res.status(500).send(err)
  }
}

const checkCourseOwnership = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.body.courseId)
    if (req.user.id === course.userId) {
      return next()
    }
    return res.status(403).send('Not enough privileges. This entity does not belong to you')
  } catch (err) {
    return res.status(500).send(err)
  }
}

export { checkSubjectOwnership, checkCourseOwnership }
