import { Evaluable, Studies } from '../models/models.js'
import { Course } from '../models/models.js'
import { Subject } from '../models/models.js'


const index = async (req, res) => {
  try {
    const studies = await Studies.findAll({ where: { userId: req.user.id } })
    res.json(studies)
  } catch (err) {
    res.status(500).send(err)
  }
}

const show = async (req, res) => {
  try {
    const studies = await Studies.findByPk(req.params.studiesId, {
      include: {
        model: Course,
        as: 'courses',
        include: { model: Subject, as: 'subjects', include: { model: Evaluable, as: 'evaluables' } }
      }
    }
  )
    res.json(studies)
  } catch (err) {
    res.status(500).send(err)
  }
}

const create = async (req, res) => {
  try {
    const newStudies = await Studies.build(req.body)
    newStudies.userId = req.user.id
    await newStudies.save()
    res.json(newStudies)
  } catch (err) {
    res.status(500).send(err)
  }
}

const update = async (req, res) => {
  try {
    await Studies.update(req.body, { where: {id: req.params.studiesId} })
    const updatedStudies = await Studies.findByPk(req.params.studiesId)
    res.json(updatedStudies)
  } catch (err) {
    res.status(500).send(err)
  }
}

const destroy = async function (req, res) {
  try {
    const result = await Studies.destroy({ where: { id: req.params.studiesId } })
    let message = ''
    if (result === 1) {
      message = 'Sucessfuly deleted Studies id.' + req.params.studiesId
    } else {
      message = 'Could not delete Studies.'
    }
    res.json(message)
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
  
const StudiesController = {
  index,
  show, 
  create,
  update,
  destroy
}
export default StudiesController
  