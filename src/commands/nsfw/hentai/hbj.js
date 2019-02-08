const { Command } = require('discord-akairo')
const { get } = require('snekfetch')

class HBJCommand extends Command {
  constructor () {
    super('hbj', {
      aliases: ['hbj'],
      category: 'nsfw',
      description: {
        content: 'Returns a random hentai fellatio.'
      },
      cooldown: 3000,
      ratelimit: 2
    })
  }

  async exec (msg) {
    const nsfwMode = this.client.settings.get(msg.guild.id, 'nsfw', [])
    if (!nsfwMode || nsfwMode === false || !msg.channel.nsfw) return msg.util.reply(':underage: We gotta go someplace NSFW for this sorta thing.')

    const loading = await this.client.emojis.get('541151509946171402')
    let m = await msg.channel.send(`${loading} **Anime sucky sucky.**`)

    const { body } = await get('https://nekos.life/api/v2/img/bj')

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(body.url)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setImage(body.url)
      .setFooter(`Requested by ${msg.author.tag} | Nekos.life API`, `${msg.author.displayAvatarURL()}`)

    m.edit({ embed })
  }
}
module.exports = HBJCommand
