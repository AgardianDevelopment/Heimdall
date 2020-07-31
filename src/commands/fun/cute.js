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
          type: ['dog', 'fox', 'cat'],
          prompt: {
            start: 'What kind of cuteness are your looking for? (dog, cat, fox, etc.)',
            retry: 'Please select dog, cat, fox, etc.'
          }
        }
      ],
      description: {
        content: 'Fetches you up something cute (dog, fox, cat)',
        useage: '<prefix>',
        examples: ['cute [animal]']
      }
    })
  }

  async exec (msg, { cuteType }) {
    // Format search text, load emojis from emoji server
    const loading = await this.client.emojis.resolve('541151509946171402')
    const ohNo = await this.client.emojis.resolve('541151482599440385')

    // Send default pending message
    const m = await msg.channel.send(`${loading} **Finding you something cute...**`)

    // Build url for various API
    const dogURL = 'https://random.dog/doggos'
    const foxURL = 'https://randomfox.ca/floof/'
    const catURL = 'https://api.thecatapi.com/v1/images/search'

    // Fetch stores and result from Various APIs
    if (cuteType === 'dog') {
      var res = await fetch(dogURL).then(res => res.json())
      if (!res[0]) return m.edit(`${ohNo} I couldn't find anycute dogs.`).then(msg.delete())
      var randomImage = res[Math.floor(Math.random() * res.length)]
      var cuteImage = 'https://random.dog/' + randomImage
    } else if (cuteType === 'fox') {
      var res = await fetch(foxURL).then(res => res.json())
      if (!res.image) return m.edit(`${ohNo} I couldn't find any cute foxes.`).then(msg.delete())
      var cuteImage = res.image
    } else if (cuteType === 'cat') {
      var res = await fetch(catURL).then(res => res.json())
      if (!res[0].url) return m.edit(`${ohNo} I couldn't find anycute cats.`).then(msg.delete())
      var cuteImage = res[0].url
    } else return m.edit(`${ohNo} Something went wrong!.`).then(msg.delete())

    // Build embed and send
    const embed = this.client.util.embed()
      .setTitle('A little dose of cuteness')
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setFooter(`Requested by ${msg.author.tag} | Cute Animal APIs`, `${msg.author.displayAvatarURL()}`)
      .setImage(cuteImage)

    m.edit({ embed }).then(msg.delete())
  }
}
module.exports = CuteCommand
