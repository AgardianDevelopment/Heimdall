const { Command } = require('discord-akairo')

class PingCommand extends Command {
  constructor () {
    super('ping', {
      aliases: ['ping'],
      category: 'general',
      description: { content: 'Pings Bjorn.' }
    })
  }

  async exec (msg) {
    // Start timing for ping response
    const start = Date.now(); msg.channel.send('**Thinking...**').then(m => {
      const diff = (Date.now() - start)

      // Build Embed
      const embed = this.client.util.embed()
        .setTitle('🔔 Pong!')
        .setColor(process.env.EMBED)
        .addField('📶 Latency', `${diff}ms`, true)

      m.delete().then(msg.channel.send({ embed }))
    })
  }
}

module.exports = PingCommand
