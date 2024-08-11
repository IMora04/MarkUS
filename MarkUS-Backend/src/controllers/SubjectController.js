import { Evaluable, EvaluableType, Subject } from '../models/models.js'

const create = async (req, res) => {
  try {
    const newSubject = await Subject.build(req.body)
    newSubject.userId = req.user.id
    await newSubject.save()
    res.json(newSubject)
  } catch (err) {
    res.status(500).send(err)
  }
} 

const show = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.subjectId, {
      include: {
        model: Evaluable,
        as: 'evaluables',
        include: {
          model: EvaluableType,
          as: 'type'
        } 
      }
    }
  )
    res.json(subject)
  } catch (err) {
    console.log(err)
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
  
const SubjectController = {
  create,
  show
}
export default SubjectController
  