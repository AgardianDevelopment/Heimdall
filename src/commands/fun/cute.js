const { Command } = require('discord-akairo')
const fetch = require('node-fetch')

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

    // Build url for various API
    const dogURL = 'https://random.dog/doggos'
    const foxURL = 'https://randomfox.ca/floof/'
    const catURL = 'https://api.thecatapi.com/v1/images/search'
    const birbURL = 'http://shibe.online/api/birds?&urls=true&httpsUrls=true'

    // Fetch stores result from Various APIs
    if (cuteType === 'dog') {
      const res = await fetch(dogURL).then(res => res.json())
      if (!res[0]) return m.edit(`${ohNo} I couldn't find anycute dogs.`).then(msg.delete())
      const randomImage = res[Math.floor(Math.random() * res.length)]
      var cuteImage = 'https://random.dog/' + randomImage
      var sourceAPI = 'random.dog'
    } else if (cuteType === 'fox') {
      const res = await fetch(foxURL).then(res => res.json())
      if (!res.image) return m.edit(`${ohNo} I couldn't find any cute foxes.`).then(msg.delete())
      var cuteImage = res.image
      var sourceAPI = 'randomfox.ca'
    } else if (cuteType === 'cat') {
      const res = await fetch(catURL).then(res => res.json())
      if (!res[0].url) return m.edit(`${ohNo} I couldn't find anycute cats.`).then(msg.delete())
      var cuteImage = res[0].url
      var sourceAPI = 'thecatapi.com'
    } else if (cuteType === 'bird') {
      const res = await fetch(birbURL).then(res => res.json())
      if (!res[0]) return m.edit(`${ohNo} I couldn't find anycute birbss.`).then(msg.delete())
      var cuteImage = res[0]
      var sourceAPI = 'shibe.online'
    } else return m.edit(`${ohNo} Something went wrong!.`).then(msg.delete())

    // Build embed and send
    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(cuteImage)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setFooter(`Requested by ${msg.author.tag} | ${sourceAPI} API`, `${msg.author.displayAvatarURL()}`)
      .setImage(cuteImage)

    m.edit({ embed }).then(msg.delete())
  }
}
module.exports = CuteCommand
