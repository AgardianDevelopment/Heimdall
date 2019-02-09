const { Command } = require('discord-akairo')
const snekfetch = require('snekfetch')

class GameCommand extends Command {
  constructor () {
    super('game', {
      aliases: ['game', 'igdb'],
      category: 'query',
      cooldown: 2000,
      ratelimit: 1,
      args: [
        {
          id: 'game',
          match: 'content',
          prompt: { start: 'Which game would you like to lookup?' }
        }
      ],
      description: {
        content: 'Search a game on IGDB',
        usage: '[game name]',
        examples: ['Fortnite']
      }
    })
  }

  async exec (msg, { game }) {
    const loading = await this.client.emojis.get('541151509946171402')
    const ohNo = await this.client.emojis.get('541151482599440385')

    let m = await msg.channel.send(`${loading} **Checking IGDB for ${game}**`)
    game.split(' ').join('+')

    try {
      var igdb = await snekfetch.get('https://api-2445582011268.apicast.io/games/?search=' + game + '&fields=*&limit=1')
        .set('user-key', process.env.IGDB).then(r => r.body[0])
    } catch (e) {
      return m.edit(`${ohNo} I couldn't find that game.`).then(msg.delete())
    }

    if (!igdb) return m.edit(`${ohNo} I couldn't find that game.`).then(msg.delete())
    if (!igdb.summary) return m.edit(`${ohNo} I couldn't find that game.`).then(msg.delete())

    if (!igdb.cover) {
      var igdbCover = 'https://i.imgur.com/HPt4eTx.png'
    } else if ((igdb.cover.url).includes('https://')) {
      var igdbCover = igdb.cover.url
    } else {
      var igdbCover = `https:${igdb.cover.url}`
    }

    let gameName = igdb.name.split(' ').join('-').replace(/:/g, '')
    let gameSummary = igdb.summary

    const embed = this.client.util.embed()
      .setTitle(igdb.name)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setFooter(`Requested by ${msg.author.tag} | IGDB API`, `${msg.author.displayAvatarURL()}`)
      .setThumbnail(igdbCover)
      .addField('Summary', `${gameSummary.substring(0, 350)}...`)
      .addField('Ratings', `${Math.round(igdb.rating)}%`, true)
      .addField('More Info', `[IGDB Results](https://www.igdb.com/games/${gameName})`, true)

    m.edit({ embed }).then(msg.delete())
  }
}

module.exports = GameCommand
