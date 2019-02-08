const { Listener } = require('discord-akairo')
const Logger = require('../../util/Logger')
const Starboard = require('../../struct/Starboard')

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
    this.client.user.setActivity(`Over ${this.client.users.size} Mortals`, { type: 'WATCHING' })

    for (const guild of this.client.guilds.values()) {
      const starboard = new Starboard(guild)
      this.client.starboards.set(guild.id, starboard)
    }
  }
}

module.exports = ReadyListener
