import { Model } from 'sequelize'
const loadModel = (sequelize, DataTypes) => {
  class EvaluableType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      EvaluableType.hasMany(models.Evaluable, { foreignKey: 'evaluableTypeId' })
      EvaluableType.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
    }
  }
  EvaluableType.init({
    name: DataTypes.STRING,
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
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
    modelName: 'EvaluableType'
  })
  return EvaluableType
}
export default loadModel
