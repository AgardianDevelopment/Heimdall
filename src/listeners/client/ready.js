const { Listener } = require('discord-akairo')
const Logger = require('../../util/Logger')
const Starboard = require('../../struct/Starboard')
const BOATS = require('boats.js')
const Boats = new BOATS(process.env.BOAT_API)

class ReadyListener extends Listener {
  constructor () {
    super('ready', {
      event: 'ready',
      emitter: 'client',
      category: 'client'
    })
  }

  exec () {
    Logger.info(`${this.client.user.tag} is ready to serve!`)
    this.client.user.setActivity(`Over ${this.client.guilds.cache.size} Realms`, { type: 'WATCHING' })

    for (const guild of this.client.guilds.cache.values()) {
      const starboard = new Starboard(guild)
      this.client.starboards.set(guild.id, starboard)
    }

    setInterval(() => {
      this.client.user.setActivity(`Over ${this.client.guilds.cache.size} Realms`, { type: 'WATCHING' })
      Boats.postStats(this.client.guilds.cache.size, process.env.BOT_ID).then(() => { console.log('Discord Boats: Guilds Posted') })
    }, 300000)
  }
}

module.exports = ReadyListener
