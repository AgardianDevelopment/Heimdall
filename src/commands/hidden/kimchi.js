const { Command } = require('discord-akairo')
const isImageUrl = require('is-image-url')
const redditApiImageGetter = require('reddit-api-image-getter')
const getter = new redditApiImageGetter()

class KimchiCommand extends Command {
  constructor () {
    super('kimchi', {
      aliases: ['kimchi'],
      category: 'hidden',
      cooldown: 5000,
      ratelimit: 2,
      description: { content: 'What you know about kimchi?' }
    })
  }

  async exec (msg) {
    const nsfwMode = this.client.settings.get(msg.guild.id, 'nsfw', [])
    if (!nsfwMode || nsfwMode === false || !msg.channel.nsfw) return msg.util.reply(':underage: We gotta go someplace NSFW for this sorta thing.')

    const loading = await this.client.emojis.resolve('541151509946171402')
    const ohNo = await this.client.emojis.resolve('541151482599440385')
    const m = await msg.channel.send(`${loading} **Now subscribed to kimchi facts!**`)

    const insult = ['Jugeullae?!', '죽을래']

    if (((msg.author.id == 138549812307034112) || (msg.author.id == 101808227385098240) || (msg.author.id == 137727774910709760)) == false) return m.edit(response[Math.floor(Math.random() * insult.length)])

    var subreddits = [
      'Nekomimi',
      'hentai',
      'HENTAI_GIF',
      'AnimeBooty',
      'hentaibondage',
      'thick_hentai',
      'ecchi',
      'Tentai'
    ]

    var img_sub = subreddits[Math.round(Math.random() * (subreddits.length - 1))]

    const response = await getter.getHotImagesOfSubReddit(img_sub)
    const randomResponse = response[Math.floor(Math.random() * response.length)].url
    if (isImageUrl(randomResponse) !== true) return m.edit(`${ohNo} Something went wrong, try again.`)

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(randomResponse)
      .setColor(process.env.EMBED)
      .setImage(randomResponse)
      .setFooter('Requested by REDACTED | via REDACTED • REDATED at XX:XX GMT', 'https://just.vulgarity.xyz/CWtyugHIu6oVFuYN.png')

    m.edit({ embed }).then(msg.delete())
  }
}

module.exports = KimchiCommand
