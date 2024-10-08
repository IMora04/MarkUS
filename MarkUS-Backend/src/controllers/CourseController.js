import { Course, Evaluable, Subject } from '../models/models.js'

const show = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.courseId, {
      include: {
        model: Subject,
        as: 'subjects',
        include: {
          model: Evaluable,
          as: 'evaluables'
        }
      }
    }
  )
    res.json(course)
  } catch (err) {
    res.status(500).send(err)
  }
}

const create = async (req, res) => {
  try {
    const newCourse = await Course.build(req.body)
    newCourse.userId = req.user.id
    await newCourse.save()
    res.json(newCourse)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

const destroy = async function (req, res) {
  try {
    const result = await Course.destroy({ where: { id: req.params.courseId } })
    let message = ''
    if (result === 1) {
      message = 'Sucessfuly deleted Course id.' + req.params.courseId
    } else {
      message = 'Could not delete Course.'
    }
    res.json(message)
  } catch (err) {
    res.status(500).send(err)
  }
}

const update = async (req, res) => {
  try {
    await Course.update(req.body, { where: {id: req.params.courseId} })
    const updatedCourse = await Course.findByPk(req.params.courseId)
    res.json(updatedCourse)
  } catch (err) {
    res.status(500).send(err)
  }
}
  
const CourseController = {
  show,
  create,
  update,
  destroy
}
export default CourseController
  