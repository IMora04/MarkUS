import { Studies } from '../models/models.js'
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
        include: { model: Subject, as: 'subjects' }
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
  create
}
export default StudiesController
  