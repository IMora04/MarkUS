import * as UserValidation from '../controllers/validation/UserValidation.js'
import UserController from '../controllers/UserController.js'
import { User } from '../models/models.js'
import { handleValidation } from '../middlewares/global/ValidationHandlingMiddleware.js'
import { isLoggedIn } from '../middlewares/global/AuthMiddleware.js'
import { checkEntityExists } from '../middlewares/global/EntityMiddleware.js'
import { handleFilesUpload } from '../middlewares/global/FileHandlerMiddleware.js'

const loadFileRoutes = function (app) {
  app.route('/users')
    .put(
      isLoggedIn,
      handleFilesUpload(['avatar'], process.env.AVATARS_FOLDER),
      UserValidation.update,
      handleValidation,
      UserController.update)
    .delete(
      isLoggedIn,
      UserController.destroy)
  app.route('/users/register')
    .post(
      handleFilesUpload(['avatar'], process.env.AVATARS_FOLDER),
      UserValidation.create,
      handleValidation,
      UserController.registerCustomer)
  app.route('/users/login')
    .post(
      UserValidation.login,
      handleValidation,
      UserController.loginCustomer)
  app.route('/users/isTokenValid')
    .put(UserController.isTokenValid)
  app.route('/users/:userId')
    .get(
      checkEntityExists(User, 'userId'),
      isLoggedIn,
      UserController.show)
}
export default loadFileRoutes
