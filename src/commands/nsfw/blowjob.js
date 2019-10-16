const { Command } = require('discord-akairo')
const Porn = require('pornsearch').search('blowjob')

class BlowJobCommand extends Command {
  constructor () {
    super('blowjob', {
      aliases: ['blowjob'],
      category: 'nsfw',
      description: {
        content: 'Random result here to give you head.'
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
    let m = await msg.channel.send(`${loading} **Cradle the balls, stroke the shaft, work the pipe, swallow the gravy.**`)

    const res = await Porn.gifs()
    var i = Math.floor(Math.random() * res.length)
    const imagePhoto = res[i].url
    console.log(imagePhoto)

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(imagePhoto)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setImage(imagePhoto)
      .setFooter(`Requested by ${msg.author.tag} | imgur API`, `${msg.author.displayAvatarURL()}`)

    m.edit({ embed }).then(msg.delete())
  }
}
module.exports = BlowJobCommand
