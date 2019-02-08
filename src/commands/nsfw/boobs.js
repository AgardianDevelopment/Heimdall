const { Command } = require('discord-akairo')
const { get } = require('snekfetch')

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
    if (!nsfwMode || nsfwMode === false || !msg.channel.nsfw) return msg.util.reply(':underage: We gotta go someplace NSFW for this sorta thing.')

    const loading = await this.client.emojis.get('541151509946171402')
    let m = await msg.channel.send(`${loading} **Look at them motherfuckers jiggle.**`)

    const { body } = await get('http://api.oboobs.ru/boobs/0/1/random')

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(`http://media.oboobs.ru/${body[0].preview}`)
      .setColor(0xfacb3e)
      .setTimestamp()
      .setImage(`http://media.oboobs.ru/${body[0].preview}`)
      .setFooter(`Requested by ${msg.author.tag} | oboobs.ru API`, `${msg.author.displayAvatarURL()}`)

    m.edit({ embed })
  }
}
module.exports = BoobsCommand
