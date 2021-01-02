const { Listener } = require('discord-akairo')
const signale = require('signale')

class CooldownListener extends Listener {
  constructor () {
    super('cooldown', {
      event: 'cooldown',
      emitter: 'commandHandler',
      category: 'commandHandler'
    })
  }

  exec (message, command, remaining) {
    const time = remaining / 1000
    const tag = message.guild ? message.guild.name : `${message.author.tag}/PM`
    signale.log(`=> ${command.id} ~ ${time}`, tag)

    if (message.guild ? message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES') : true) {
      message.reply(`You can use that command again in ${time} seconds.`)
    }
  }
}

module.exports = CooldownListener
