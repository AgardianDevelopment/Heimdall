const { Command } = require('discord-akairo')
const nekoClient = require('nekos.life')
const { nsfw } = new nekoClient()

class EroCommand extends Command {
  constructor () {
    super('ero', {
      aliases: ['ero'],
      category: 'nsfw',
      description: {
        content: 'Returns a random naughty ero.'
      },
      cooldown: 3000,
      ratelimit: 2
    })
  }

  async exec (msg) {
    const nsfwMode = this.client.settings.get(msg.guild.id, 'nsfw', [])
    if (nsfwMode != true || !msg.channel.nsfw) return msg.util.reply(':underage: We gotta go someplace NSFW for this sorta thing.')

    const loading = await this.client.emojis.resolve('541151509946171402')
    const m = await msg.channel.send(`${loading} **Erotic anime? Don't you mean hentai...**`)

    const { url } = await nsfw.ero()

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
module.exports = EroCommand
