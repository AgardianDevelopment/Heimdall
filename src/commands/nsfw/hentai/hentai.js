const { Command } = require('discord-akairo')
const fetch = require('node-fetch')

class HentaiCommand extends Command {
  constructor () {
    super('hentai', {
      aliases: ['hentai'],
      category: 'nsfw',
      description: {
        content: 'When anime gets naughty.'
      },
      cooldown: 3000,
      ratelimit: 2
    })
  }

  async exec (msg) {
    const nsfwMode = this.client.settings.get(msg.guild.id, 'nsfw', [])
    if (nsfwMode != true || !msg.channel.nsfw) return msg.util.reply(':underage: We gotta go someplace NSFW for this sorta thing.')

    const loading = await this.client.emojis.resolve('541151509946171402')
    const m = await msg.channel.send(`${loading} **Get you some anime sex.**`)

    const res = await fetch('https://nekobot.xyz/api/image?type=hentai').then(res => res.json())

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(res.message)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setImage(res.message)
      .setFooter(`Requested by ${msg.author.tag} | NekoBot API`, `${msg.author.displayAvatarURL()}`)

    m.edit({ embed }).then(msg.delete())
  }
}
module.exports = HentaiCommand
