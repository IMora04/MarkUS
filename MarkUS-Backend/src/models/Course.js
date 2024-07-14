import { Model } from 'sequelize'
const loadModel = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Course.belongsTo(models.Studies, { foreignKey: 'studiesId', as: 'studies' })
      Course.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
      Course.hasMany(models.Subject, { foreignKey: 'courseId', as: 'subjects' })
    }

  }
  Course.init({
    number: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    credits: DataTypes.INTEGER,
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    studiesId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM,
      values: [
        'not taken',
        'studying',
        'taken',
      ],
      defaultValue: 'not taken'
    },
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
    modelName: 'Course'
  })
  return Course
}
export default loadModel
