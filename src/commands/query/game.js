const { Command } = require('discord-akairo')
const axios = require('axios')
const Auths = require('../../models/auths.js')

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
    // Load Twitch Auth Token From DB
    const auth = await Auths.findOne({ where: { service: 'twitchAPI' } })

    // Loading emojis from emoji server
    const loading = await this.client.emojis.resolve(process.env.LOADING)
    const ohNo = await this.client.emojis.resolve(process.env.CROSS)

    // Send default pending message
    const m = await msg.channel.send(`${loading} **Checking IGDB for ${game}**`)
    game.split(' ').join('+')
    // Fetch Configuration for Game
    const config = {
      method: 'post',
      url: `https://api.igdb.com/v4/games/?search=${game}&limit=1&fields=id,age_ratings,franchise,first_release_date,name,platforms,rating,screenshots,slug,summary,url,cover.url`,
      headers: {
        'Client-ID': process.env.TWITCH_ID,
        Authorization: `Bearer ${auth.token}`,
        Accept: 'application/json'
      }
    }

    const gameRes = await axios(config)
    const gameSearch = gameRes.data[0]

    // Error message is no game is found
    if (gameSearch === undefined) {
      return m.edit(`${ohNo} I couldn't find that game.`).then(msg.delete()).then(m.delete({ timeout: 5000 }))
    } else {
      var summary = gameSearch.summary
    }

    if (!gameSearch.cover) {
      var gameCover = 'https://i.imgur.com/k9k4szN.png'
    } else {
      var gameCover = 'https:' + gameSearch.cover.url
    }

    // Convert Epoch date to Human readable
    const releaseDate = new Date(gameSearch.first_release_date * 1000).toLocaleDateString('en-US')

    // Build embeded message
    const embed = this.client.util.embed()
      .setTitle(gameSearch.name)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setThumbnail(gameCover)
      .setFooter(`Requested by ${msg.author.tag} | IGDB API`, `${msg.author.displayAvatarURL()}`)
      .addField('Summary', `${summary.substring(0, 350)}...`)
      .addField('Ratings', `${Math.round(gameSearch.rating)}%`, true)
      .addField('Release Date', releaseDate, true)
      .addField('More Info', `[IGDB Results](${gameSearch.url})`, true)

    // Send edited embed message
    m.edit({ embed }).then(msg.delete())
  }
}

module.exports = GameCommand
