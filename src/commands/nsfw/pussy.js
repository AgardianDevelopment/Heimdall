const { Command } = require('discord-akairo')
const nekoAPI = require('../../helpers/nekoAPIs')

class PussyCommand extends Command {
  constructor () {
    super('pussy', {
      aliases: ['pussy'],
      category: 'nsfw',
      description: {
        content: 'Returns a random result with pussy in mind.'
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
    const m = await msg.channel.send(`${loading} **Putting out the cat food!**`)

    const searchData = await nekoAPI.nekoBot('pussy')

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
module.exports = PussyCommand
