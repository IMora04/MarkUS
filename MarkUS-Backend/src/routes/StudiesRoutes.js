import * as StudiesValidation from '../controllers/validation/StudiesValidation.js'
import StudiesController from '../controllers/StudiesController.js'
import { Studies } from '../models/models.js'
import { handleValidation } from '../middlewares/global/ValidationHandlingMiddleware.js'
import { isLoggedIn } from '../middlewares/global/AuthMiddleware.js'
import { checkEntityExists } from '../middlewares/global/EntityMiddleware.js'
import * as StudiesMiddleware from '../middlewares/StudiesMiddleware.js'

const loadFileRoutes = function (app) {
  app.route('/studies')
    .get(
      isLoggedIn,
      StudiesController.index
    )
    .post(
      isLoggedIn,
      StudiesValidation.create,
      handleValidation,
      StudiesController.create
    )
    
  app.route('/studies/:studiesId')
    .get(
      isLoggedIn,
      checkEntityExists(Studies, 'studiesId'),
      StudiesMiddleware.checkStudiesOwnership,
      StudiesController.show
    )
    .put(
      isLoggedIn,
      checkEntityExists(Studies, 'studiesId'),
      StudiesMiddleware.checkStudiesOwnership,
      StudiesValidation.update,
      handleValidation,
      StudiesController.update
    )
    .delete(
      isLoggedIn,
      checkEntityExists(Studies, 'studiesId'),
      StudiesMiddleware.checkStudiesOwnership,
      StudiesController.destroy
    )
}

export default loadFileRoutes