import { Model } from 'sequelize'
import moment from 'moment'

const loadModel = (sequelize, DataTypes) => {
  class Studies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Studies.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
      Studies.hasMany(models.Course, { foreignKey: 'studiesId', as: 'courses' })
    }

  }
  Studies.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    credits: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    logo: DataTypes.STRING,
    hasTrimesters: DataTypes.BOOLEAN,
    status: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: [
        'studying',
        'finished',
      ],
      defaultValue: 'studying'
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    years: DataTypes.INTEGER,
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: new Date()
    }
  }, {
    sequelize,
    modelName: 'Studies'
  })
  return Studies
}
export default loadModel
