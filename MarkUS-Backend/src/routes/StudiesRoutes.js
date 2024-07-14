//import * as StudiesValidation from '../controllers/validation/StudiesValidation.js'
import StudiesController from '../controllers/StudiesController.js'
import { Studies } from '../models/models.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import { isLoggedIn } from '../middlewares/AuthMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import { handleFilesUpload } from '../middlewares/FileHandlerMiddleware.js'

const loadFileRoutes = function (app) {
    app.route('/studies')
    .get(
      isLoggedIn,
      StudiesController.index
    )
    .post(
      StudiesController.create
    )
  app.route('/studies/:studiesId')
    .get(
      isLoggedIn,
      checkEntityExists(Studies, 'studiesId'),
      //StudiesMiddleware.checkStudiesOwnership,
      StudiesController.show
    )
}

export default loadFileRoutes