const { Command } = require('discord-akairo')
const nekoClient = require('nekos.life')
const { nsfw } = new nekoClient()

class HFemdomCommand extends Command {
  constructor () {
    super('hfemdom', {
      aliases: ['hfemdom'],
      category: 'nsfw',
      description: {
        content: 'In mother russia anime dom you.'
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

    const { url } = await nsfw.femdom()

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
module.exports = HFemdomCommand
