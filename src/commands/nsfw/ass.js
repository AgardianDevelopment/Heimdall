const { Command } = require('discord-akairo')
const nekoAPI = require('../../helpers/nekoBot')

class AssCommand extends Command {
  constructor () {
    super('ass', {
      aliases: ['ass'],
      category: 'nsfw',
      description: {
        content: 'Returns a random result about an ass.'
      },
      cooldown: 3000,
      ratelimit: 2
    })
  }

  async exec (msg) {
    const nsfwMode = this.client.settings.get(msg.guild.id, 'nsfw', [])
    if (nsfwMode !== true || !msg.channel.nsfw) return msg.util.reply(':underage: We gotta go someplace NSFW for this sorta thing.')

    const loading = await this.client.emojis.resolve('541151509946171402')
    const m = await msg.channel.send(`${loading} **Baby got back!**`)

    const searchData = await nekoAPI.search('ass')

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
module.exports = AssCommand
