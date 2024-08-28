import { Studies } from '../models/models.js'

const checkStudiesOwnership = async (req, res, next) => {
  try {
    const studies = await Studies.findByPk(req.params.studiesId)
    if (req.user.id === studies.userId) {
      return next()
    }
    return res.status(403).send('Not enough privileges. This entity does not belong to you')
  } catch (err) {
    return res.status(500).send(err)
  }
}

export { checkStudiesOwnership }
