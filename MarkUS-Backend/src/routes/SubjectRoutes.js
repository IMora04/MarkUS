//import * as StudiesValidation from '../controllers/validation/StudiesValidation.js'
import { Subject } from '../models/models.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import { isLoggedIn } from '../middlewares/AuthMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import { handleFilesUpload } from '../middlewares/FileHandlerMiddleware.js'
import SubjectController from '../controllers/SubjectController.js'

const loadFileRoutes = function (app) {
  //TODO: All
  app.route('/subjects')
    .post(
      isLoggedIn,
      SubjectController.create
    )
}

export default loadFileRoutes