const { Command } = require('discord-akairo')
const nekoClient = require('nekos.life')
const { nsfw } = new nekoClient()

class KemonomimiCommand extends Command {
  constructor () {
    super('kemonomimi', {
      aliases: ['kemonomimi', 'kemo'],
      category: 'nsfw',
      description: {
        content: 'So your only a little bit furry?.'
      },
      cooldown: 3000,
      ratelimit: 2
    })
  }

  async exec (msg) {
    const nsfwMode = this.client.settings.get(msg.guild.id, 'nsfw', [])
    if (nsfwMode != true || !msg.channel.nsfw) return msg.util.reply(':underage: We gotta go someplace NSFW for this sorta thing.')

    const loading = await this.client.emojis.resolve('541151509946171402')
    const m = await msg.channel.send(`${loading} **Get you some anime sex.**`)

    const { url } = await nsfw.kemonomimi()

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(url)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setImage(url)
      .setFooter(`Requested by ${msg.author.tag} | Nekos.life API`, `${msg.author.displayAvatarURL()}`)

    m.edit({ embed }).then(msg.delete())
  }
}
module.exports = KemonomimiCommand
