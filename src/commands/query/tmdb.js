const { Command } = require('discord-akairo')
const tmdbAPI = require('../../helpers/tmdbAPI')
const signale = require('signale')

class tmdbCommand extends Command {
  constructor () {
    super('tmdb', {
      aliases: ['tmdb', 'imdb'],
      category: 'query',
      cooldown: 2000,
      ratelimit: 1,
      args: [
        {
          id: 'mediaType',
          type: ['movie', 'series', 'actor'],
          prompt: {
            start: 'Are you searching for a movie ("movie"), televsion show ("series") or Actor ("actor")?',
            retry: 'Please select type movie, series, or actor.'
          }
        },
        {
          id: 'searchTerm',
          match: 'rest',
          prompt: { start: 'What is the name of the movie/series you want to know about?' }
        }
      ],
      description: {
        content: 'Search a Movie, Series, or Actor on TMDB.',
        usage: '[type] [search term]',
        examples: ['movie how to train your dragon']
      }
    })
  }

  async exec (msg, { mediaType, searchTerm }) {
    // Format search string
    var string = searchTerm
    var string = string.substring().split(' ')
    const search = string.join('%20')

    // Load emojis from emoji server
    const loading = await this.client.emojis.resolve(process.env.LOADING)
    const ohNo = await this.client.emojis.resolve(process.env.CROSS)

    // Send default pending message
    const m = await msg.channel.send(`${loading} **Searching on TMDB...**`)

    // Try fetching results from TMDB API for movies, error is none found
    if (mediaType === 'movie') {
      try {
        const movieResults = await tmdbAPI.movie(searchTerm)

        const embed = this.client.util.embed()
          .setTitle(movieResults.title)
          .setColor(process.env.EMBED)
          .setTimestamp()
          .setFooter(`Requested by ${msg.author.tag} | TMDB API`, `${msg.author.displayAvatarURL()}`)
          .setDescription(movieResults.overview)
          .setThumbnail('https://image.tmdb.org/t/p/w500' + movieResults.poster_path)
          .addField('User Rating', `${movieResults.vote_average}/10`, true)
          .addField('Release Date', movieResults.release_date, true)
          .addField('More Info', `[TMDB](https://www.themoviedb.org/movie/${movieResults.id})`)

        m.edit({ embed }).then(msg.delete())
      } catch (err) {
        signale.error({ prefix: '[Movie Query]', message: err.message })
        return m.edit(`${ohNo} Couldn't find that movie...`).then(msg.delete(), m.delete({ timeout: 5000 }))
      }
      // Try fetching results from TMDB API if for series, error if none found
    } else if (mediaType === 'series') {
      try {
        const seriesResults = await tmdbAPI.series(searchTerm)

        const embed = this.client.util.embed()
          .setTitle(seriesResults.name)
          .setColor(process.env.EMBED)
          .setTimestamp()
          .setFooter(`Requested by ${msg.author.tag} | TMDB API`, `${msg.author.displayAvatarURL()}`)
          .setDescription(seriesResults.overview)
          .setThumbnail('https://image.tmdb.org/t/p/w500' + seriesResults.poster_path)
          .addField('User Rating', `${seriesResults.vote_average}/10`, true)
          .addField('Air Date', seriesResults.first_air_date, true)
          .addField('More Info', `[TMDB](https://www.themoviedb.org/tv/${seriesResults.id})`)

        m.edit({ embed }).then(msg.delete())
      } catch (err) {
        signale.error({ prefix: '[Series Query]', message: err.message })
        return m.edit(`${ohNo} Couldn't find that series...`).then(msg.delete(), m.delete({ timeout: 5000 }))
      }
      // Fetch results from TMDB API for actors, error if none found
    } else if (mediaType === 'actor') {
      try {
        const actorResults = await tmdbAPI.actor(searchTerm)

        const embed = this.client.util.embed()
          .setTitle(actorResults.name)
          .setColor(process.env.EMBED)
          .setTimestamp()
          .setFooter(`Requested by ${msg.author.tag} | TMDB API`, `${msg.author.displayAvatarURL()}`)
          .setThumbnail('https://image.tmdb.org/t/p/w500' + actorResults.profile_path)
          .addField('Known For', `${actorResults.known_for[0].title}, ${actorResults.known_for[1].title}, ${actorResults.known_for[2].title}`)
          .addField('More Info', `[TMDB](https://www.themoviedb.org/person/${actorResults.id})`)

        m.edit({ embed }).then(msg.delete())
      } catch (err) {
        signale.error({ prefix: '[Actor Query]', message: err.message })
        return m.edit(`${ohNo} Couldn't find that actor...`).then(msg.delete(), m.delete({ timeout: 5000 }))
      }
      // Catch all error message
    } else return m.edit(`${ohNo} Something went wrong I'm sorry.`).then(msg.delete())
  }
}

module.exports = tmdbCommand
