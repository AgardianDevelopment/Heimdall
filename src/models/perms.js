const { db } = require('../struct/Database')
const Sequelize = require('sequelize')

const Perms = db.define('hidden_perms', {
  userID: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  userName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  datbutt: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'false'
  },
  kimchi: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'false'
  },
  tentai: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: 'false'
  }
})

module.exports = Perms
