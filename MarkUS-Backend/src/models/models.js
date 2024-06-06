import Sequelize from 'sequelize'
import getEnvironmentConfig from '../config/config.js'
import loadUserModel from './User.js'
import loadStudiesModel from './Studies.js'
import loadCourseModel from './Course.js'
import loadSubjectModel from './Subject.js'
import loadEvaluableModel from './Evaluable.js'
import loadEvaluableTypeModel from './EvaluableType.js'


const sequelizeSession = new Sequelize(getEnvironmentConfig().database, getEnvironmentConfig().username, getEnvironmentConfig().password, getEnvironmentConfig())
const User = loadUserModel(sequelizeSession, Sequelize.DataTypes)
const Studies = loadStudiesModel(sequelizeSession, Sequelize.DataTypes)
const Course = loadCourseModel(sequelizeSession, Sequelize.DataTypes)
const Subject = loadSubjectModel(sequelizeSession, Sequelize.DataTypes)
const Evaluable = loadEvaluableModel(sequelizeSession, Sequelize.DataTypes)
const EvaluableType = loadEvaluableTypeModel(sequelizeSession, Sequelize.DataTypes)

const db = { User, Studies, Course, Subject, Evaluable, EvaluableType }

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

export { User, Studies, Course, Subject, Evaluable, EvaluableType, sequelizeSession }
