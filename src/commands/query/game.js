const { Command } = require('discord-akairo')
const fetch = require('node-fetch')
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
    const tokenConfig = {
      method: 'post',
      url: `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_ID}&client_secret=${process.env.TWITCH_SECRET}&grant_type=client_credentials`,
      headers: { }
    }

    const tokenFetch = await axios(tokenConfig)
    const tokenData = tokenFetch.data.access_token

    // Loading emojis from emoji server
    const loading = await this.client.emojis.resolve(process.env.LOADING)
    const ohNo = await this.client.emojis.resolve(process.env.CROSS)

    // Send default pending message
    const m = await msg.channel.send(`${loading} **Checking IGDB for ${game}**`)
    game.split(' ').join('+')
    // Fetch Configuration for Game
    var gameRequestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Client-ID': process.env.TWITCH_ID,
        Authorization: `Bearer ${tokenData}`
      },
      redirect: 'follow'
    }

    var gameRes = await fetch('https://api.igdb.com/v4/games/?search=' + game + '&fields=id,age_ratings,franchise,first_release_date,name,platforms,rating,screenshots,slug,summary,url,cover&limit=1', gameRequestOptions).then(res => res.json())
    var gameSearch = gameRes[0]

    // Error message is no game is found
    if (!gameSearch.summary) return m.edit(`${ohNo} I couldn't find that game.`).then(msg.delete())

    const gameSummary = gameSearch.summary

    // Convert Epoch date to Human readable
    const releaseDate = new Date(gameSearch.first_release_date * 1000).toLocaleDateString('en-US')

    // Build embeded message
    const embed = this.client.util.embed()
      .setTitle(gameSearch.name)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setFooter(`Requested by ${msg.author.tag} | IGDB API`, `${msg.author.displayAvatarURL()}`)
      .addField('Summary', `${gameSummary.substring(0, 350)}...`)
      .addField('Ratings', `${Math.round(gameSearch.rating)}%`, true)
      .addField('Release Date', releaseDate, true)
      .addField('More Info', `[IGDB Results](${gameSearch.url})`, true)

    // Send edited embed message
    m.edit({ embed }).then(msg.delete())
  }
}

module.exports = GameCommand
