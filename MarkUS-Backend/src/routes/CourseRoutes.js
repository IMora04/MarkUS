//import * as StudiesValidation from '../controllers/validation/StudiesValidation.js'
import { Course } from '../models/models.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import { isLoggedIn } from '../middlewares/AuthMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import { handleFilesUpload } from '../middlewares/FileHandlerMiddleware.js'
import CourseController from '../controllers/CourseController.js'

const loadFileRoutes = function (app) {
  app.route('/courses/:courseId')
    .get(
      isLoggedIn,
      checkEntityExists(Course, 'courseId'),
      //StudiesMiddleware.checkStudiesOwnership,
      CourseController.show
    )
}

export default loadFileRoutes