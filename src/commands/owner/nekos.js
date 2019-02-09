const { Command } = require('discord-akairo')
const { get } = require('snekfetch')

class NekosCommand extends Command {
  constructor () {
    super('nekos', {
      aliases: ['nekos'],
      category: 'nsfw',
      ownerOnly: true,
      args: [
        {
          id: 'searchTerm',
          prompt: { start: 'Enter search term.' }
        }
      ]
    })
  }

  async exec (msg, { searchTerm }) {
    const nsfwMode = this.client.settings.get(msg.guild.id, 'nsfw', [])
    if (!nsfwMode || nsfwMode === false || !msg.channel.nsfw) return msg.util.reply(':underage: We gotta go someplace NSFW for this sorta thing.')

    const loading = await this.client.emojis.get('541151509946171402')
    let m = await msg.channel.send(`${loading} **It's time for that anime load.**`)

    const { body } = await get(`https://nekos.life/api/v2/img/${searchTerm}`)

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
module.exports = NekosCommand
