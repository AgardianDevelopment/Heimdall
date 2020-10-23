const { Command } = require('discord-akairo')
const fetch = require('node-fetch')

class ChronoCommand extends Command {
  constructor () {
    super('chrono', {
      aliases: ['chrono'],
      category: 'query',
      cooldown: 2000,
      ratelimit: 1,
      description: {
        content: 'Current game deal on chrono.gg',
        useage: '<prefix>'
      }
    })
  }

  async exec (msg) {
    // Load emojis from emoji server
    const loading = await this.client.emojis.resolve(process.env.LOADING)
    const ohNo = await this.client.emojis.resolve(process.env.CROSS)

    // Send default pending message
    const m = await msg.channel.send(`${loading} **Checking out chrono.gg...**`)

    // Fetch results from Chrono.gg API and check for results
    const res = await fetch('https://api.chrono.gg/sale').then(res => res.json())
    if (res.length === 0) return m.edit(`${ohNo} Couldn't find any deals...`).then(msg.delete())

    // Build embed and send
    const embed = this.client.util.embed()
      .setTitle(res.name)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setFooter(`Requested by ${msg.author.tag} | Chrono API`, `${msg.author.displayAvatarURL()}`)
      .setThumbnail(res.promo_image)
      .addField('Price', [
        `**Normal Price:** $${res.normal_price}`,
        `**Sale Price:** $${res.sale_price}`
      ], true)
      .addField('Links', [
        `[**Chrono.gg**](${res.unique_url})`,
        `[**Steam**](${res.steam_url})`
      ], true)
      .addField('Platform', res.platforms.toString())

    m.edit({ embed }).then(msg.delete())
  }
}
module.exports = ChronoCommand
