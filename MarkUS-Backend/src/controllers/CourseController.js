import { Course, Evaluable, Subject } from '../models/models.js'

const show = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.courseId, {
      include: {
        model: Subject,
        as: 'subjects',
        include: { model: Evaluable, as: 'evaluables' }
      }
    }
  )
    res.json(course)
  } catch (err) {
    res.status(500).send(err)
  }
}

const show2 = async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.courseId, {
        include: {
          model: Subject,
          as: 'subjects',
          include: { model: Evaluable, as: 'evaluables' }
        }
      }
    )
      res.json(course)
    } catch (err) {
      res.status(500).send(err)
    }
  }
  

const _register = async (req, res, userType) => {
  try {
    req.body.userType = userType
    const newUser = new User(req.body)
    const registeredUser = await newUser.save()
    const updatedUser = await _updateToken(registeredUser.id, _createUserTokenDTO())
    res.json(updatedUser)
  } catch (err) {
    if (err.name.includes('ValidationError') || err.name.includes('SequelizeUniqueConstraintError')) {
      res.status(422).send(err)
    } else {
      res.status(500).send(err)
    }
  }
}
  
const CourseController = {
  show,
  show2
}
export default CourseController
  