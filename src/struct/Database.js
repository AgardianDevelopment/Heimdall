const signale = require('signale')
const path = require('path')
const readdir = require('util').promisify(require('fs').readdir)
const Sequelize = require('sequelize')

const db = new Sequelize(process.env.DATABASE, { logging: false })

class Database {
  static get db () {
    return db
  }

  static async authenticate () {
    try {
      await db.authenticate()
      signale.success({ prefix: '[Postgres]', message: 'Connection to database has been established successfully.' })
      await this.loadModels(path.join(__dirname, '..', 'models'))
    } catch (err) {
      signale.error({ prefix: '[Postgres]', message: 'Unable to connect to the datbase:' })
      signale.log({ prefix: '[Postgres]', message: err })
      signale.info({ prefix: '[Postgres]', message: 'Attempting to connect again in 5 seconds...' })
      setTimeout(this.authenticate, 5000)
    }
  }

  static async loadModels (modelsPath) {
    const files = await readdir(modelsPath)

    for (const file of files) {
      const filePath = path.join(modelsPath, file)
      if (!filePath.endsWith('.js')) continue
      await require(filePath).sync({ alter: true }) // eslint-disable-line no-await-in-loop
    }
  }
}

module.exports = Database
