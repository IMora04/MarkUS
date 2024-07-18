import { Studies } from '../models/models.js'

const checkStudiesExists = async (req, res, next) => {
  try {
    const studiesId = req.body.studiesId
    const studies = await Studies.findByPk(studiesId)
    if (!studies) {
      return res.status(409).send('Studies not found')
    }
    return next()
  } catch (err) {
    return res.status(500).send(err)
  }
}

export { checkStudiesExists }
