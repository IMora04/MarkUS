import { Subject } from '../models/models.js'
import { handleValidation } from '../middlewares/global/ValidationHandlingMiddleware.js'
import { isLoggedIn } from '../middlewares/global/AuthMiddleware.js'
import { checkEntityExists } from '../middlewares/global/EntityMiddleware.js'
import SubjectController from '../controllers/SubjectController.js'
import * as SubjectValidation from '../controllers/validation/SubjectValidation.js'
import * as SubjectMiddleware from '../middlewares/SubjectMiddleware.js'

const loadFileRoutes = function (app) {
  app.route('/subjects')
    .post(
      isLoggedIn,
      SubjectMiddleware.checkCourseOwnership,
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