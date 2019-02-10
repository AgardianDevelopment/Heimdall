const { Listener } = require('discord-akairo')
const { post } = require('snekfetch')
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

    post(`https://discordbots.org/api/bots/${process.env.BFD_APP}/stats`)
      .set('Authorization', `${process.env.BFD_TOKEN}`)
      .send({ server_count: this.client.guilds.size })
      .then(Logger.info('Updated botsfordiscord.com Guild Size', { tag: 'BotsForDiscord' })).catch(e => Logger.error('Something went wrong, check BFD details.', { tag: 'BotsForDiscord' }))
  }
}

module.exports = ReadyListener
