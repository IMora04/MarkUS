import { Model } from 'sequelize'
const loadModel = (sequelize, DataTypes) => {
  class Evaluable extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      Evaluable.belongsTo(models.Studies, { foreignKey: 'subjectId', as: 'subject' })
      Evaluable.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
      Evaluable.hasOne(models.EvaluableType, { foreignKey: 'evaluableTypeId', as: 'type' })
    }

  }
  Evaluable.init({
    evaluableTypeId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },    
    subjectId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },    
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER
    },
    mark: DataTypes.DOUBLE,
    weight: DataTypes.INTEGER,  
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
    modelName: 'Evaluable'
  })
  return Evaluable
}
export default loadModel
