import { Studies } from '../models/models.js'

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
    const studies = await Studies.findByPk(req.params.studiesId)
    res.json(studies)
  } catch (err) {
    res.status(500).send(err)
  }
}
  
const StudiesController = {
  index,
  show
}
export default StudiesController
  