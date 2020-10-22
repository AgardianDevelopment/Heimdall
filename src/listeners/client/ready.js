const { Listener } = require('discord-akairo')
const Logger = require('../../util/Logger')
const Starboard = require('../../struct/Starboard')
// const BOATS = require('boats.js')
// const Boats = new BOATS(process.env.BOAT_API)
// const DBL = require('dblapi.js')
// const dbl = new DBL(process.env.TOP_API, this.client)

class ReadyListener extends Listener {
  constructor () {
    super('ready', {
      event: 'ready',
      emitter: 'client',
      category: 'client'
    })
  }

  exec () {
    const client = this.client

    /* Log Information about the bot */
    Logger.info(`${client.user.tag} is ready to serve!`, { tag: 'Client' })

    /* Post Intial Client Activity */
    client.user.setActivity(`Over ${this.client.guilds.cache.size} Realms`, { type: 'WATCHING' })

    /* Bot Listings STATS */
    const topStats = require('../../helpers/listTop')
    topStats.init(client)
    const boatStats = require('../../helpers/listBoats')
    boatStats.init(client)

    /* Intialize Starboard */
    for (const guild of this.client.guilds.cache.values()) {
      const starboard = new Starboard(guild)
      client.starboards.set(guild.id, starboard)
    }

    /* Post client Activity every 20 seconds */
    setInterval(() => {
      client.user.setActivity(`Over ${this.client.guilds.cache.size} Realms`, { type: 'WATCHING' })
    }, 20000)
  }
}

module.exports = ReadyListener
