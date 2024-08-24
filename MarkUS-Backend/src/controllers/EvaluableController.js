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
    const newEvaluable = await Evaluable.build(req.body)
    newEvaluable.userId = req.user.id
    await newEvaluable.save()
    res.json(newEvaluable)
  } catch (err) {
    res.status(500).send(err)
  }
}
  
const EvaluableController = {
  indexTypes,
  create
}
export default EvaluableController
  