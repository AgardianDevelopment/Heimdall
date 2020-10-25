const { Command } = require('discord-akairo')
const isImageUrl = require('is-image-url')
const redditApiImageGetter = require('reddit-api-image-getter')
const getter = new redditApiImageGetter()
const Perms = require('../../models/perms.js')

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

    const permission = await Perms.findAll({ where: { userID: msg.author.id } })

    const insult = ['Jugeullae?!', '죽을래']

    if (permission.length === 0) return msg.channel.send(insult[Math.floor(Math.random() * insult.length)]).then(msg.delete())
    if (permission[0].dataValues.kimchi === 'false') return msg.channel.send(insult[Math.floor(Math.random() * insult.length)]).then(msg.delete())

    const loading = await this.client.emojis.resolve(process.env.LOADING)
    const ohNo = await this.client.emojis.resolve(process.env.CROSS)

    const m = await msg.channel.send(`${loading} **Now subscribed to kimchi facts!**`)

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

    const imgSub = subreddits[Math.round(Math.random() * (subreddits.length - 1))]

    const response = await getter.getHotImagesOfSubReddit(imgSub)
    const randomResponse = response[Math.floor(Math.random() * response.length)].url
    if (isImageUrl(randomResponse) !== true) return m.edit(`${ohNo} Something went wrong, try again.`)

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(randomResponse)
      .setColor(process.env.EMBED)
      .setImage(randomResponse)
      .setFooter('Requested by REDACTED | via REDACTED • REDATED at XX:XX GMT', 'https://just.vulgarity.xyz/CWtyugHIu6oVFuYN.png')

    msg.channel.send({ embed })
      .then(msg.delete())
      .then(m.delete())
  }
}

module.exports = KimchiCommand
