import { Course, Studies } from '../models/models.js'
import { handleValidation } from '../middlewares/global/ValidationHandlingMiddleware.js'
import { isLoggedIn } from '../middlewares/global/AuthMiddleware.js'
import { checkEntityExists } from '../middlewares/global/EntityMiddleware.js'
import CourseController from '../controllers/CourseController.js'
import * as CourseValidation from '../controllers/validation/CourseValidation.js'
import * as CourseMiddleware from '../middlewares/CourseMiddleware.js'

const loadFileRoutes = function (app) {
  app.route('/courses')
  .post(
    isLoggedIn,
    CourseMiddleware.checkStudiesOwnership,
    CourseValidation.create,
    handleValidation,
    CourseController.create
  )
  
  app.route('/courses/:courseId')
    .get(
      isLoggedIn,
      checkEntityExists(Course, 'courseId'),
      CourseMiddleware.checkCourseOwnership,
      CourseController.show
    )
    .put(
      isLoggedIn,
      checkEntityExists(Course, 'courseId'),
      CourseMiddleware.checkCourseOwnership,
      CourseValidation.update,
      handleValidation,
      CourseController.update
    )
    .delete(
      isLoggedIn,
      checkEntityExists(Course, 'courseId'),
      CourseMiddleware.checkCourseOwnership,
      CourseController.destroy
    )

}

export default loadFileRoutes