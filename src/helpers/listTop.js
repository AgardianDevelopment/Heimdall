const DBL = require('dblapi.js')

const Logger = require('../util/Logger')
const TOP_API = process.env.TOP_API

module.exports = {
  init (client) {
    // If Key exists post stats to Top.gg every ten minutes
    if (TOP_API === undefined) {
      Logger.warn('Unable to post stats, will no longer try.', { tag: 'Top.gg' })
    } else {
      const topStats = new DBL(TOP_API, client)
      setInterval(function () {
        topStats.postStats(client.guilds.cache.size).then(() => { Logger.info('Server size posted', { tag: 'Top.gg' }) })
      }, 60000 * 10)
    }
  }
}
