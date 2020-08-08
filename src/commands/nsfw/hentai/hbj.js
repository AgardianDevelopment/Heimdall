const { Command } = require('discord-akairo')
const fetch = require('node-fetch')

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
    if (nsfwMode != true || !msg.channel.nsfw) return msg.util.reply(':underage: We gotta go someplace NSFW for this sorta thing.')

    const loading = await this.client.emojis.resolve('541151509946171402')
    const m = await msg.channel.send(`${loading} **Anime sucky sucky.**`)

    const res = await fetch('https://nekos.life/api/v2/img/bj').then(res => res.json())

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(res.url)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setImage(res.url)
      .setFooter(`Requested by ${msg.author.tag} | Nekos.life API`, `${msg.author.displayAvatarURL()}`)

    m.edit({ embed }).then(msg.delete())
  }
}
module.exports = HBJCommand
