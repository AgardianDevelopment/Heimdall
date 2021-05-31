const { Listener } = require('discord-akairo')
const signale = require('signale')

class StatAutoPost extends Listener {
  constructor () {
    super('autoPostStart', {
      event: 'autopost-start',
      emitter: 'statCord',
      category: 'statCord'
    })
  }

  exec () {
    signale.info({ prefix: '[StatCord]', message: 'Auto post started' })
  }
}

module.exports = StatAutoPost
