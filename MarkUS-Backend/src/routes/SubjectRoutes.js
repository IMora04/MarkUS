import { Subject } from '../models/models.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import { isLoggedIn } from '../middlewares/AuthMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import SubjectController from '../controllers/SubjectController.js'
import * as CourseMiddleware from '../middlewares/CourseMiddleware.js'
import * as SubjectValidation from '../controllers/validation/SubjectValidation.js'
import * as SubjectMiddleware from '../middlewares/SubjectMiddleware.js'

const loadFileRoutes = function (app) {
  app.route('/subjects')
    .post(
      isLoggedIn,
      CourseMiddleware.checkCourseOwnership,
      SubjectValidation.create,
      handleValidation,
      SubjectController.create
    )

  app.route('/subjects/:subjectId')
    .get(
      isLoggedIn,
      checkEntityExists(Subject, 'subjectId'),
      SubjectMiddleware.checkSubjectOwnership,
      SubjectController.show
    )
    .delete(
      isLoggedIn,
      checkEntityExists(Subject, 'subjectId'),
      SubjectMiddleware.checkSubjectOwnership,
      SubjectController.destroy
    )
}

export default loadFileRoutes