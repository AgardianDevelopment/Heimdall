const { Listener } = require('discord-akairo')
const signale = require('signale')

class ErrorListener extends Listener {
  constructor () {
    super('error', {
      event: 'error',
      emitter: 'commandHandler',
      category: 'commandHandler'
    })
  }

  exec (err, message) {
    signale.error('An error occured in a command.')

    const tag = message.guild ? message.guild.name : `${message.author.tag}/PM`
    signale.error(message.content, { tag })
    signale.debug(err)

    if (message.guild ? message.channel.permissionsFor(this.client.user).has('SEND_MESSAGES') : true) {
      message.channel.send([
        'An error occured, please submit an issue on https://github.com/Jotunn-Development/heimdallr/issues.',
        '```js',
        err.toString(),
        '```',
        'Include the information about with your github issue.'
      ])
    }
  }
}

module.exports = ErrorListener
