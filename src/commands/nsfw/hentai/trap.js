const { Command } = require('discord-akairo')
const axios = require('axios')

class TrapCommand extends Command {
  constructor () {
    super('trap', {
      aliases: ['trap'],
      category: 'nsfw',
      description: {
        content: 'Returns a random hentai trap'
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
    const m = await msg.channel.send(`${loading} **Surprise, it's a dick!**`)

    const config = {
      method: 'get',
      url: 'https://waifu.pics/api/nsfw/trap'
    }

    const searchData = await axios(config)

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(searchData.data.url)
      .setColor(process.env.EMBED)
      .setImage(searchData.data.url)
      .setFooter(`Requested by ${msg.author.tag} | Waifu.Pics API`, `${msg.author.displayAvatarURL()}`)

    msg.channel.send({ embed })
      .then(msg.delete())
      .then(m.delete())
  }
}
module.exports = TrapCommand
