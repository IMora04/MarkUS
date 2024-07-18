//import * as StudiesValidation from '../controllers/validation/StudiesValidation.js'
import StudiesController from '../controllers/StudiesController.js'
import { Studies } from '../models/models.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import { isLoggedIn } from '../middlewares/AuthMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import { handleFilesUpload } from '../middlewares/FileHandlerMiddleware.js'

const loadFileRoutes = function (app) {
  //TODO: All
  app.route('/studies')
    .get(
      isLoggedIn,
      StudiesController.index
    )
    .post(
      isLoggedIn,
      StudiesController.create
    )
    
  //TODO: All
  app.route('/studies/:studiesId')
    .get(
      isLoggedIn,
      checkEntityExists(Studies, 'studiesId'),
      //StudiesMiddleware.checkStudiesOwnership,
      StudiesController.show
    )
    .put(
      isLoggedIn,
      checkEntityExists(Studies, 'studiesId'),
      //StudiesMiddleware.checkStudiesOwnership,
      StudiesController.update
    )
    .delete(
      isLoggedIn,
      checkEntityExists(Studies, 'studiesId'),
      //StudiesMiddleware.checkStudiesOwnership,
      StudiesController.destroy
    )
}

export default loadFileRoutes