import { isLoggedIn } from '../middlewares/global/AuthMiddleware.js'
import EvaluableController from '../controllers/EvaluableController.js'
import { handleValidation } from '../middlewares/global/ValidationHandlingMiddleware.js'
import * as EvaluableValidation from '../controllers/validation/EvaluableValidation.js'
import * as EvaluableMiddleware from '../middlewares/EvaluableMiddleware.js'
import { checkEntityExists } from '../middlewares/global/EntityMiddleware.js'
import { Evaluable } from '../models/models.js'

const loadFileRoutes = function (app) {
  app.route('/evaluableTypes')
  .get(
    isLoggedIn,
    EvaluableController.indexTypes
  )
  .post(
    isLoggedIn,
    EvaluableValidation.createType,
    handleValidation,
    EvaluableController.createType
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

  app.route('/evaluable/:evaluableId')
  .put(
    isLoggedIn,
    checkEntityExists(Evaluable, 'evaluableId'),
    EvaluableMiddleware.checkSubjectOwnership,
    EvaluableMiddleware.checkEvaluableTypeOwnership,
    EvaluableMiddleware.checkEvaluableOwnership,
    EvaluableValidation.update,
    handleValidation,
    EvaluableController.update
  )
  .delete(
    isLoggedIn,
    checkEntityExists(Evaluable, 'evaluableId'),
    EvaluableMiddleware.checkEvaluableOwnership,
    EvaluableController.destroy
  )
}

export default loadFileRoutes