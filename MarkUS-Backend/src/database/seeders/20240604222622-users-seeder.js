const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(5)
const fs = require('fs')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {})
    */
    module.exports.copyFiles()

    await queryInterface.bulkInsert('Users',
      [
        { firstName: 'Customer 1', lastName: 'Fake 1', email: 'customer1@customer.com', password: bcrypt.hashSync('secret', salt), avatar: process.env.AVATARS_FOLDER + '/maleAvatar.png' }
      ], {})
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {})
     */
    const { sequelize } = queryInterface
    try {
      await sequelize.transaction(async (transaction) => {
        const options = { transaction }
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', options)
        await sequelize.query('TRUNCATE TABLE Users', options)
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options)
      })
    } catch (error) {
      console.error(error)
    }
  },
  copyFiles: () => {
    const originDir = 'public/example_assets/'
    const destinationDir = process.env.AVATARS_FOLDER + '/'
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true })
    }

    fs.copyFile(originDir + 'maleAvatar.png', destinationDir + 'maleAvatar.png', (err) => {
      if (err) throw err
    })
    fs.copyFile(originDir + 'femaleAvatar.png', destinationDir + 'femaleAvatar.png', (err) => {
      if (err) throw err
    })
  }
}
