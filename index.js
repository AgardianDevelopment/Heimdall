require('./src/util/Extensions')
require('dotenv').config()

const signale = require('signale')
const config = process.env.config
const HeimdallClient = require('./src/struct/HeimdallClient')

const client = new HeimdallClient(config)

client
  .on('disconnect', () => signale.warn({ prefix: '[Client]', message: 'Connection lost...' }))
  .on('reconnect', () => signale.info({ prefix: '[Client]', message: 'Attempting to reconnect...' }))
  .on('error', (err) => signale.error({ prefix: '[Client]', message: err.message }))
  .on('warn', (info) => signale.warn({ prefix: '[Client]', message: info }))

client.start()

process.on('unhandledRejection', (err) => {
  signale.warn({ prefix: '[Client]', message: 'An unhandled promise rejection occured' })
  signale.log({ prefix: '[Client]', message: err.message })
})
