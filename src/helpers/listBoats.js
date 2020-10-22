const BOATS = require('boats.js')

const Logger = require('../util/Logger')
const BOAT_API = process.env.BOAT_API

module.exports = {
  init (client) {
    // If Key exists post stats to Discord.boats every ten minutes
    if (BOAT_API === undefined) {
      return Logger.warn('Unable to post stats, will no longer try.', { tag: 'Discord.boats' })
    } else {
      const boatStats = new BOATS(process.env.BOAT_API)
      boatStats.postStats(client.guilds.cache.size, process.env.BOT_ID).then(() => { Logger.info('Server size posted', { tag: 'Discord.boats' }) })
      setInterval(function () {
        boatStats.postStats(client.guilds.cache.size, process.env.BOT_ID).then(() => { Logger.info('Server size posted', { tag: 'Discord.boats' }) })
      }, 60000 * 10)
    }
  }
}
