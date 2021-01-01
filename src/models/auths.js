const { db } = require('../struct/Database')
const Sequelize = require('sequelize')

const Auths = db.define('auths', {
  service: {
    type: Sequelize.STRING,
    primaryKey: true,
    allowNull: false
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false,
    default: 'unknown'
  }
})

module.exports = Auths
