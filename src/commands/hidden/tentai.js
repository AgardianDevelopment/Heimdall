const { Command } = require('discord-akairo')
const isImageUrl = require('is-image-url')
const redditApiImageGetter = require('reddit-api-image-getter')
const getter = new redditApiImageGetter()
const Perms = require('../../models/hiddenPerms.js')

class TentaiCommand extends Command {
  constructor () {
    super('tentai', {
      aliases: ['tentai'],
      category: 'hidden',
      cooldown: 5000,
      ratelimit: 2,
      description: { content: 'Is it really forbidden is you love it?' }
    })
  }

  async exec (msg) {
    const nsfwMode = this.client.settings.get(msg.guild.id, 'nsfw', [])
    if (!nsfwMode || nsfwMode === false || !msg.channel.nsfw) return msg.util.reply(':underage: We gotta go someplace NSFW for this sorta thing.')

    const permission = await Perms.findAll({ where: { userID: msg.author.id, tentai: 'true' } })

    const insult = ['くそくらえ', 'でぶ', 'This is what you get for getting a A- in math', 'いやらしい']

    if (permission.length === 0) return msg.channel.send(insult[Math.floor(Math.random() * insult.length)]).then(msg.delete())

    const loading = await this.client.emojis.resolve(process.env.LOADING)
    const ohNo = await this.client.emojis.resolve(process.env.CROSS)

    const m = await msg.channel.send(`${loading} **Now subscribed to vine facts!**`)

    var subreddits = [
      'Tentai',
      'consentacles',
      'Meatwalls'
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
      .setFooter('Requested by REDACTED | via REDACTED • REDATED at XX:XX GMT', 'https://i.imgur.com/GfqYVlU.png')

    msg.channel.send({ embed })
      .then(msg.delete())
      .then(m.delete())
  }
}

module.exports = TentaiCommand
