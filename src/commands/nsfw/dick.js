const { Command } = require('discord-akairo')
const isImageUrl = require('is-image-url')
const redditApiImageGetter = require('reddit-api-image-getter')
const getter = new redditApiImageGetter()

class DickCommand extends Command {
  constructor () {
    super('dick', {
      aliases: ['dick'],
      category: 'nsfw',
      description: {
        content: 'Returns a random result of sword fighting.'
      },
      cooldown: 3000,
      ratelimit: 2

    })
  }

  async exec (msg) {
    const nsfwMode = this.client.settings.get(msg.guild.id, 'nsfw', [])
    if (nsfwMode != true || !msg.channel.nsfw) return msg.util.reply(':underage: We gotta go someplace NSFW for this sorta thing.')

    const loading = await this.client.emojis.resolve('541151509946171402')
    const ohNo = await this.client.emojis.resolve('541151482599440385')
    const m = await msg.channel.send(`${loading} **Is that a dick in your pocket or....**`)

    const response = await getter.getHotImagesOfSubReddit('penis')
    const randomResponse = response[Math.floor(Math.random() * response.length)].url
    if (isImageUrl(randomResponse) !== true) return m.edit(`${ohNo} Something went wrong, try again.`)

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(randomResponse)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setImage(randomResponse)
      .setFooter(`Requested by ${msg.author.tag} | imgur API`, `${msg.author.displayAvatarURL()}`)

    m.edit({ embed }).then(msg.delete())
  }r
}
module.exports = DickCommand
