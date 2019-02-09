const { Command } = require('discord-akairo')
const snekfetch = require('snekfetch')

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

    const loading = await this.client.emojis.get('541151509946171402')
    const ohNo = await this.client.emojis.get('541151482599440385')
    let m = await msg.channel.send(`${loading} **Now subscribed to kimchi facts!**`)

    let response = ['Jugeullae?!', '죽을래']

    if (((msg.author.id == 138549812307034112) || (msg.author.id == 101808227385098240)) == false) return m.edit(response[Math.floor(Math.random() * response.length)])

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

    try {
      var image = await snekfetch.get(`https://api.imgur.com/3/gallery/r/${img_sub}`).set('authorization', 'Client-ID ' + process.env.IMGUR).then(r => r.body)
    } catch (e) {
      return m.edit(`${ohNo} Looks like something went wrong.`).then(msg.delete())
    }

    if (image.status == 403) {
      return m.edit(`${ohNo} Looks like something went wrong.`).then(msg.delete())
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
      .setImage(imagePhoto)
      .setFooter(`Requested by REDACTED | via REDACTED • REDATED at XX:XX GMT`, `https://just.vulgarity.xyz/CWtyugHIu6oVFuYN.png`)

    m.edit({ embed }).then(msg.delete())
  }
}

module.exports = KimchiCommand
