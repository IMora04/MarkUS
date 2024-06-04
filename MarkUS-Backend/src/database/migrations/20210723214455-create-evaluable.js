module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Evaluables', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      evaluableTypeId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'EvaluableTypes'
          },
          key: 'id'
        },
        onDelete: 'cascade'
      },    
      subjectId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Subjects'
          },
          key: 'id'
        },
        onDelete: 'cascade'
      },    
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'id'
        },
        onDelete: 'cascade'
      },
      mark: Sequelize.INTEGER,
      weight: Sequelize.INTEGER,  
        createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Evaluables')
  }
}
