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
    allowNull: true
  },
  kimchi: {
    type: Sequelize.STRING,
    allowNull: true
  },
  tentai: {
    type: Sequelize.STRING,
    allowNull: true
  }
})

module.exports = HiddenPerms
