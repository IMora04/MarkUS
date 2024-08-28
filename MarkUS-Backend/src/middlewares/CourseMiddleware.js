import { Studies, Course } from '../models/models.js'

const checkStudiesExistsAndOwnership = async (req, res, next) => {
  try {
    const studiesId = req.body.studiesId
    const studies = await Studies.findByPk(studiesId)
    if (!studies) {
      return res.status(409).send('Studies not found')
    }
    if (req.user.id !== studies.userId) {
      return res.status(403).send('Not enough privileges. This entity does not belong to you')
    }
    return next()
  } catch (err) {
    return res.status(500).send(err)
  }
}

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

export { checkStudiesExistsAndOwnership, checkCourseOwnership }
