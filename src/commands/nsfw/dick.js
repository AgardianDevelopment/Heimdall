const { Command } = require('discord-akairo')
const { get } = require('snekfetch')

class DickCommand extends Command {
  constructor () {
    super('dick', {
      aliases: ['dick'],
      category: 'nsfw',
      description: {
        content: 'Returns a random result with a long boi.'
      },
      cooldown: 3000,
      ratelimit: 2

    })
  }

  async exec (msg) {
    const nsfwMode = this.client.settings.get(msg.guild.id, 'nsfw', [])
    if (nsfwMode != true || !msg.channel.nsfw) return msg.util.reply(':underage: We gotta go someplace NSFW for this sorta thing.')

    const loading = await this.client.emojis.get('541151509946171402')
    const ohNo = await this.client.emojis.get('541151482599440385')
    let m = await msg.channel.send(`${loading} **Is that a dick in your pocket or....**`)

    let subreddits = [
      'curved_cock',
      'dicks',
      'penis',
      'MalesMasturbating'
    ]

    let img_sub = subreddits[Math.round(Math.random() * (subreddits.length - 1))]

    try {
      var image = await get(`https://api.imgur.com/3/gallery/r/${img_sub}`).set('authorization', 'Client-ID ' + process.env.IMGUR).then(r => r.body)
    } catch (e) {
      return m.edit(`${ohNo} Looks like something went wrong.`).then(console.log(e))
    }

    if (image.status == 403) {
      return m.edit(`${ohNo} Looks like something went wrong.`)
    }

    var i = Math.floor(Math.random() * image.data.length)

    if (image.data[i].is_album === true) {
      var imagePhoto = image.data[i].images[0].link
    } else {
      var imagePhoto = image.data[i].link
    }

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(imagePhoto)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setImage(imagePhoto)
      .setFooter(`Requested by ${msg.author.tag} | imgur API`, `${msg.author.displayAvatarURL()}`)

    m.edit({ embed }).then(msg.delete()).then(msg.delete())
  }
}
module.exports = DickCommand
