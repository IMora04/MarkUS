import { isLoggedIn } from '../middlewares/AuthMiddleware.js'
import EvaluableController from '../controllers/EvaluableController.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import * as EvaluableValidation from '../controllers/validation/EvaluableValidation.js'

const loadFileRoutes = function (app) {
  app.route('/evaluableTypes')
  .get(
    isLoggedIn,
    EvaluableController.indexTypes
  )
  app.route('/evaluable')
  .post(
    isLoggedIn,
    EvaluableValidation.create,
    handleValidation,
    EvaluableController.create
  )
}

export default loadFileRoutes