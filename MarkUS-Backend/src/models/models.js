import Sequelize from 'sequelize'
import getEnvironmentConfig from '../config/config.js'
import loadUserModel from './User.js'

const sequelizeSession = new Sequelize(getEnvironmentConfig().database, getEnvironmentConfig().username, getEnvironmentConfig().password, getEnvironmentConfig())
const User = loadUserModel(sequelizeSession, Sequelize.DataTypes)

const db = { User }

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

export { User, sequelizeSession }
