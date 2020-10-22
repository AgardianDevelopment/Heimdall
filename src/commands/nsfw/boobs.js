const { Command } = require('discord-akairo')
const nekoAPI = require('../../helpers/nekoBot')

class BoobsCommand extends Command {
  constructor () {
    super('boobs', {
      aliases: ['boobs', 'tits'],
      category: 'nsfw',
      description: {
        content: 'Search for a random set of boobs.'
      },
      cooldown: 3000,
      ratelimit: 2
    })
  }

  async exec (msg) {
    const nsfwMode = this.client.settings.get(msg.guild.id, 'nsfw', [])
    if (nsfwMode !== true || !msg.channel.nsfw) return msg.util.reply(':underage: We gotta go someplace NSFW for this sorta thing.')

    const loading = await this.client.emojis.resolve('541151509946171402')
    const m = await msg.channel.send(`${loading} **Look at them motherfuckers jiggle.**`)

    const searchData = await nekoAPI.search('boobs')

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(searchData.message)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setImage(searchData.message)
      .setFooter(`Requested by ${msg.author.tag} | NekoBot API`, `${msg.author.displayAvatarURL()}`)

    msg.channel.send({ embed })
      .then(msg.delete())
      .then(m.delete())
  }
}
module.exports = BoobsCommand
