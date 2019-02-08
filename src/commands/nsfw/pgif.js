const { Command } = require('discord-akairo')
const { get } = require('snekfetch')

class PGifCommand extends Command {
  constructor () {
    super('pgif', {
      aliases: ['pgif'],
      category: 'nsfw',
      description: {
        content: 'Returns a random porn gif.'
      },
      cooldown: 3000,
      ratelimit: 2
    })
  }

  async exec (msg) {
    const nsfwMode = this.client.settings.get(msg.guild.id, 'nsfw', [])
    if (!nsfwMode || nsfwMode === false || !msg.channel.nsfw) return msg.util.reply(':underage: We gotta go someplace NSFW for this sorta thing.')

    const loading = await this.client.emojis.get('541151509946171402')
    let m = await msg.channel.send(`${loading} **Calculating thrust vector.**`)

    const { body } = await get('https://nekobot.xyz/api/image?type=pgif')

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(body.message)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setImage(body.message)
      .setFooter(`Requested by ${msg.author.tag} | NekoBot API`, `${msg.author.displayAvatarURL()}`)

    m.edit({ embed })
  }
}
module.exports = PGifCommand
