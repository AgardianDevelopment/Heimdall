const BOATS = require('boats.js')
const signale = require('signale')
const BOAT_API = process.env.BOAT_API

module.exports = {
  init (client) {
    // If Key exists post stats to Discord.boats every ten minutes
    if (BOAT_API === undefined) {
      return signale.pause({ prefix: '[Discord.Boats]', message: 'Unable to post stats, will no longer try.' })
    } else {
      const boatStats = new BOATS(process.env.BOAT_API)
      setInterval(function () {
        boatStats.postStats(client.guilds.cache.size, process.env.BOT_ID).then(() => { signale.complete({ prefix: '[Discord.Boats]', message: 'Server size posted' }) })
      }, 60000 * 10)
    }
  }
}
