const { db } = require('../struct/Database')
const Sequelize = require('sequelize')

const HiddenPerms = db.define('hiddenPerms', {
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
    allowNull: true,
    default: 'false'
  },
  kimchi: {
    type: Sequelize.STRING,
    allowNull: true,
    default: 'false'
  },
  tentai: {
    type: Sequelize.STRING,
    allowNull: true,
    default: 'false'
  },
  angel: {
    type: Sequelize.STRING,
    allowNull: true,
    default: 'false'
  }
})

module.exports = HiddenPerms
