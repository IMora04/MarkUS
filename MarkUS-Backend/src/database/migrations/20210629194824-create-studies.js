module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Studies', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      credits: {
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.TEXT
      },
      hasTrimesters: {
        type: Sequelize.BOOLEAN
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: [
          'studying',
          'finished',
        ],
        defaultValue: 'studying'
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Users'
          },
          key: 'id'
        }
      },
      years: {
        type: Sequelize.INTEGER
      },
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
    await queryInterface.dropTable('Studies')
  }
}
