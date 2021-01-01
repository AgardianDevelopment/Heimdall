const DBL = require('dblapi.js')
const signale = require('signale')
const TOP_API = process.env.TOP_API

module.exports = {
  init (client) {
    // If Key exists post stats to Top.gg every ten minutes
    if (TOP_API === undefined) {
      signale.pause({ prefix: '[Top.gg]', message: 'Unable to post stats, will no longer try.' })
    } else {
      const topStats = new DBL(TOP_API, client)
      setInterval(function () {
        topStats.postStats(client.guilds.cache.size).then(() => { signale.complete({ prefix: '[Top.gg]', message: 'Server size posted' }) })
      }, 60000 * 10)
    }
  }
}
