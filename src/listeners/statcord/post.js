const { Listener } = require('discord-akairo')
const signale = require('signale')

class StatAutoPost extends Listener {
  constructor () {
    super('statcordPost', {
      event: 'post',
      emitter: 'statCord',
      category: 'statCord'
    })
  }

  exec (status) {
    if (status !== false) {
      signale.info({ prefix: '[StatCord]', message: `An error occured while posting to statcord ${status}` })
    }
  }
}

module.exports = StatAutoPost
