const { Listener } = require('discord-akairo')
const snekfetch = require('snekfetch')
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
    this.client.user.setActivity(`Over ${this.client.guilds.size} Realms`, { type: 'WATCHING' })

    for (const guild of this.client.guilds.values()) {
      const starboard = new Starboard(guild)
      this.client.starboards.set(guild.id, starboard)
    }

    setInterval(() => {
      this.client.user.setActivity(`Over ${this.client.guilds.size} Realms`, { type: 'WATCHING' })

      snekfetch.post(`https://botsfordiscord.com/api/bot/${process.env.BFD_APP}`)
        .set('Authorization', `${process.env.BFD_TOKEN}`)
        .send({ server_count: this.client.guilds.size })
        .then(Logger.info('Updated botsfordiscord.com Guild Size', { tag: 'BotsForDiscord' })).catch(e => Logger.error('Unable to post stats.', { tag: 'BotsForDiscord' }))
    }, 60000)
  }
}

module.exports = ReadyListener
