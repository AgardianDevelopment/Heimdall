const { Command } = require('discord-akairo')
const { get } = require('superagent')

class HCumCommand extends Command {
  constructor () {
    super('hcum', {
      aliases: ['hcum'],
      category: 'nsfw',
      description: {
        content: 'Returns a random hentai cumshot.'
      },
      cooldown: 3000,
      ratelimit: 2
    })
  }

  async exec (msg) {
    const nsfwMode = this.client.settings.get(msg.guild.id, 'nsfw', [])
    if (nsfwMode != true || !msg.channel.nsfw) return msg.util.reply(':underage: We gotta go someplace NSFW for this sorta thing.')

    const loading = await this.client.emojis.get('541151509946171402')
    let m = await msg.channel.send(`${loading} **It's time for that anime load.**`)

    const { body } = await get('https://nekos.life/api/v2/img/cum')

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(body.url)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setImage(body.url)
      .setFooter(`Requested by ${msg.author.tag} | Nekos.life API`, `${msg.author.displayAvatarURL()}`)

    m.edit({ embed }).then(msg.delete())
  }
}
module.exports = HCumCommand
