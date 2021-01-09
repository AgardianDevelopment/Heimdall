const { Command } = require('discord-akairo')
const funHelper = require('../../helpers/funHelper')
const signale = require('signale')

class CuteCommand extends Command {
  constructor () {
    super('cute', {
      aliases: ['cute'],
      category: 'query',
      cooldown: 2000,
      ratelimit: 1,
      args: [
        {
          id: 'cuteType',
          type: ['dog', 'fox', 'cat', 'bird'],
          prompt: {
            start: 'What kind of cuteness are your looking for? (dog, cat, fox, bird, etc.)',
            retry: 'Please select dog, cat, fox, etc.'
          }
        }
      ],
      description: {
        content: 'Fetches you up something cute (dog, fox, cat, or bird)',
        useage: '<prefix>',
        examples: ['dog', 'cat', 'fox', 'bird']
      }
    })
  }

  async exec (msg, { cuteType }) {
    // Format search text, load emojis from emoji server
    const loading = await this.client.emojis.resolve(process.env.LOADING)
    const ohNo = await this.client.emojis.resolve(process.env.CROSS)

    // Send default pending message
    const m = await msg.channel.send(`${loading} **Finding you something cute...**`)

    // API call based on type
    try {
      const searchData = await funHelper.cute(cuteType)

      if (cuteType === 'dog') {
        var sourceAPI = 'random.dog'
      } else if (cuteType === 'fox') {
        var sourceAPI = 'randomfox.ca'
      } else if (cuteType === 'cat') {
        var sourceAPI = 'thecatapi.com'
      } else if (cuteType === 'bird') {
        var sourceAPI = 'shibe.online'
      } else return m.edit(`${ohNo} Something went wrong!.`).then(msg.delete())

      const embed = this.client.util.embed()
        .setTitle('Image didn\'t load click here.')
        .setURL(searchData)
        .setColor(process.env.EMBED)
        .setTimestamp()
        .setFooter(`Requested by ${msg.author.tag} | ${sourceAPI} API`, `${msg.author.displayAvatarURL()}`)
        .setImage(searchData)

      msg.channel.send({ embed })
        .then(msg.delete())
        .then(m.delete())
    } catch (err) {
      signale.error({ prefix: '[Cute]', message: err.message })
      return m.edit(`${ohNo} Couldn't find a cute ${cuteType}...`).then(msg.delete(), m.delete({ timeout: 5000 }))
    }
  }
}
module.exports = CuteCommand
