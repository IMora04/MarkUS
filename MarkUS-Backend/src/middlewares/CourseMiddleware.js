import { Course } from '../models/models.js'

const checkCourseOwnership = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.courseId)
    if (req.user.id === course.userId) {
      return next()
    }
    return res.status(403).send('Not enough privileges. This entity does not belong to you')
  } catch (err) {
    return res.status(500).send(err)
  }
}

const checkStudiesOwnership = async (req, res, next) => {
  try {
    const studies = await Course.findByPk(req.body.studiesId)
    if (req.user.id === studies.userId) {
      return next()
    }
    return res.status(403).send('Not enough privileges. This entity does not belong to you')
  } catch (err) {
    return res.status(500).send(err)
  }
}

export { checkCourseOwnership, checkStudiesOwnership }
