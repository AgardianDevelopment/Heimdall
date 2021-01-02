const { Listener } = require('discord-akairo')
const signale = require('signale')

class CommandStartedListener extends Listener {
  constructor () {
    super('commandStarted', {
      event: 'commandStarted',
      emitter: 'commandHandler',
      category: 'commandHandler'
    })
  }

  exec (message, command) {
    const tag = message.guild ? message.guild.name : `${message.author.tag}/PM`
    signale.info(`=> ${command.id} on`, tag)
  }
}

module.exports = CommandStartedListener
