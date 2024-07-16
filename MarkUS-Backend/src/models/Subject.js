import { Model } from 'sequelize'
const loadModel = (sequelize, DataTypes) => {
  class Subject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Subject.belongsTo(models.Course, { foreignKey: 'courseId', as: 'course' })
      Subject.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
      Subject.hasMany(models.Evaluable, { foreignKey: 'subjectId', as: 'evaluables' })
    }

  }
  Subject.init({
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    shortName: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    isAnual: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    secondSemester: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    credits: DataTypes.INTEGER,
    courseId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    avgMark: DataTypes.DOUBLE,
    officialMark: DataTypes.DOUBLE,
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
    modelName: 'Subject'
  })
  return Subject
}
export default loadModel
