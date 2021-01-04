const { Command } = require('discord-akairo')
const nekoAPI = require('../../../helpers/nekoAPIs')

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
    msg.delete()
    if (nsfwMode !== true || !msg.channel.nsfw) return msg.util.reply(':underage: We gotta go someplace NSFW for this sorta thing.').then(msg => { msg.delete({ timeout: 5000 }) })

    const loading = await this.client.emojis.resolve(process.env.LOADING)
    const m = await msg.channel.send(`${loading} **Erotic anime? Don't you mean hentai...**`)

    const searchData = await nekoAPI.nekoLife('ero')

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(searchData.url)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setImage(searchData.url)
      .setFooter(`Requested by ${msg.author.tag} | NekoBot API`, `${msg.author.displayAvatarURL()}`)

    msg.channel.send({ embed })
      .then(msg.delete())
      .then(m.delete())
  }
}
module.exports = EroCommand
