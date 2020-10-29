const { Command } = require('discord-akairo')
const kitsuAPI = require('../../helpers/kitsu')
const signale = require('signale')

class AnimeCommand extends Command {
  constructor () {
    super('anime', {
      aliases: ['anime'],
      category: 'query',
      cooldown: 2000,
      ratelimit: 1,
      args: [
        {
          id: 'anime',
          match: 'content',
          prompt: {
            start: 'Which anime would you like to search for?',
            retry: 'Please enter a valid search term.'
          }
        }
      ],
      description: {
        content: 'Search for an anime',
        useage: '<prefix>',
        examples: ['[anime title]', 'Cowboy Bebop']
      }
    })
  }

  async exec (msg, { anime }) {
    // Load emojis from emoji server
    const loading = await this.client.emojis.resolve(process.env.LOADING)
    const ohNo = await this.client.emojis.resolve(process.env.CROSS)

    // Send default pending message
    const m = await msg.channel.send(`${loading} **Let's see ${anime} huh?**`)

    // Try fetching results from Kitsu API, send error if not found
    try {
      const searchData = await kitsuAPI.anime(anime)

      const url = `https://kitsu.io/anime/${searchData.attributes.slug}`

      // Build embed and send
      const embed = this.client.util.embed()
        .setTitle(searchData.attributes.titles.en + ' | ' + searchData.attributes.titles.ja_jp)
        .setURL(url)
        .setDescription(`**Synopsis:**\n${searchData.attributes.synopsis.substring(0, 450)}...`)
        .setColor(process.env.EMBED)
        .setTimestamp()
        .setFooter(`Requested by ${msg.author.tag} | Kitsu API`, `${msg.author.displayAvatarURL()}`)
        .setThumbnail(searchData.attributes.posterImage.small)
        .addField('❯ Type', searchData.attributes.showType, true)
        .addField('❯ Average Score', `${searchData.attributes.averageRating}%`, true)
        .addField('❯ # of Episodes', searchData.attributes.episodeCount, true)
        .addField('❯ Duration', searchData.attributes.episodeLength + ' mins', true)
        .addField('❯ Content Guide', `${searchData.attributes.ageRating} | ${searchData.attributes.ageRatingGuide}`)

      msg.channel.send({ embed })
        .then(msg.delete())
        .then(m.delete())
    } catch (e) {
      signale.error({ prefix: '[Anime Query]', message: e.message })
      return m.edit(`${ohNo} Couldn't find that anime...`).then(msg.delete(), m.delete({ timeout: 5000 }))
    }
  }
}
module.exports = AnimeCommand
