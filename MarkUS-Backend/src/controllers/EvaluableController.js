import { EvaluableType } from '../models/models.js'
import { Evaluable } from '../models/models.js'

const indexTypes = async (req, res) => {
  try {
    const evaluableTypes = await EvaluableType.findAll({ where: { userId: req.user.id } })
    res.json(evaluableTypes)
  } catch (err) {
    res.status(500).send(err)
  }
}

const create = async (req, res) => {
  try {
    if (req.body.mark === '') {
      req.body.mark = null
    }
    const newEvaluable = await Evaluable.build(req.body)
    newEvaluable.userId = req.user.id
    await newEvaluable.save()
    res.json(newEvaluable)
  } catch (err) {
    res.status(500).send(err)
  }
}

const update = async (req, res) => {
  try {
    if (req.body.mark === '') {
      req.body.mark = null
    }
    await Evaluable.update(req.body, {where: { id: req.params.evaluableId }})
    const updatedEvaluable = await Evaluable.findByPk(req.params.evaluableId)
    res.json(updatedEvaluable)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

const destroy = async (req, res) => {
  try {
    const result = await Evaluable.destroy({ where: { id: req.params.evaluableId } })
    let message = ''
    if (result === 1) {
      message = 'Sucessfuly deleted Evaluable with id ' + req.params.evaluableId
    } else {
      message = 'Could not delete Evaluable.'
    }
    res.json(message)
  } catch (err) {
    res.status(500).send(err)
  }
}
  
const EvaluableController = {
  indexTypes,
  create,
  update, 
  destroy
}
export default EvaluableController
  