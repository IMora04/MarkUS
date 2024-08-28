import { isLoggedIn } from '../middlewares/global/AuthMiddleware.js'
import EvaluableController from '../controllers/EvaluableController.js'
import { handleValidation } from '../middlewares/global/ValidationHandlingMiddleware.js'
import * as EvaluableValidation from '../controllers/validation/EvaluableValidation.js'
import * as EvaluableMiddleware from '../middlewares/EvaluableMiddleware.js'

const loadFileRoutes = function (app) {
  app.route('/evaluableTypes')
  .get(
    isLoggedIn,
    EvaluableController.indexTypes
  )

  app.route('/evaluable')
  .post(
    isLoggedIn,
    EvaluableMiddleware.checkSubjectOwnership,
    EvaluableMiddleware.checkEvaluableTypeOwnership,
    EvaluableValidation.create,
    handleValidation,
    EvaluableController.create
  )
}

export default loadFileRoutes