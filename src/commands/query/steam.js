const { Command } = require('discord-akairo')
const { get } = require('snekfetch')

class SteamCommand extends Command {
  constructor () {
    super('steam', {
      aliases: ['steam'],
      category: 'query',
      cooldown: 2000,
      ratelimit: 1,
      args: [
        {
          id: 'searchTerm',
          match: 'content',
          prompt: {
            start: 'What game would you like to check sales on?',
            retry: 'Please enter a valid game name.'
          }
        }
      ],
      description: {
        content: 'Searches game sales via steam',
        useage: '<prefix>',
        examples: ['steam [game name]', 'cs skyrim']
      }
    })
  }

  async exec (msg, { searchTerm }) {
    const search = searchTerm.split(' ').join('+')
    const loading = await this.client.emojis.get('541151509946171402')
    const ohNo = await this.client.emojis.get('541151482599440385')

    let m = await msg.channel.send(`${loading} **Searching on steam...**`)

    const res = await get('http://www.cheapshark.com/api/1.0/deals?lowerPrice&title=' + search + '&pageSize=2')
    if (res.body.length === 0) return m.edit(`${ohNo} I couldn't find that game.`)

    const embed = this.client.util.embed()
      .setTitle(res.body[0].title)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setFooter(`Requested by ${msg.author.tag} | Cheapshark API`, `${msg.author.displayAvatarURL()}`)
      .setThumbnail(res.body[0].thumb)
      .addField('Sale Price', res.body[0].salePrice, true)
      .addField('Normal Price', res.body[0].normalPrice, true)
      .addField('Savings', `${res.body[0].savings.substring(0, 2)}%`, true)
      .addField('Deal Rating', res.body[0].dealRating, true)
      .addField('Steam Rating', res.body[0].steamRatingText, true)
      .addField('Steam Store', `[Click Here](https://www.cheapshark.com/redirect.php?dealID=${res.body[0].dealID})`, true)

    m.edit({ embed }).then(msg.delete())
  }
}
module.exports = SteamCommand
