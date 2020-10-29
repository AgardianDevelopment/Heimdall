const { Command } = require('discord-akairo')
const kitsuAPI = require('../../helpers/kitsu')
const signale = require('signale')

class MangaCommand extends Command {
  constructor () {
    super('manga', {
      aliases: ['manga'],
      category: 'query',
      cooldown: 2000,
      ratelimit: 1,
      args: [
        {
          id: 'manga',
          match: 'content',
          prompt: {
            start: 'Which manga would you like to search for?',
            retry: 'Please enter a valid search term.'
          }
        }
      ],
      description: {
        content: 'Search for an manga',
        useage: '<prefix>',
        examples: ['[manga title]', 'Cowboy Bebop']
      }
    })
  }

  async exec (msg, { manga }) {
    // Load emojis from emoji server
    const loading = await this.client.emojis.resolve(process.env.LOADING)
    const ohNo = await this.client.emojis.resolve(process.env.CROSS)

    // Send default pending message
    const m = await msg.channel.send(`${loading} **Let's see ${manga} huh?**`)

    // Try fetching results from Kitsu API, send error if not found
    try {
      const searchData = await kitsuAPI.manga(manga)

      const url = `https://kitsu.io/manga/${searchData.attributes.slug}`

      // Build embed and send
      const embed = this.client.util.embed()
        .setTitle(searchData.attributes.titles.canonical)
        .setURL(url)
        .setDescription(`**Synopsis:**\n${searchData.attributes.synopsis.substring(0, 450)}...`)
        .setColor(process.env.EMBED)
        .setTimestamp()
        .setFooter(`Requested by ${msg.author.tag} | Kitsu API`, `${msg.author.displayAvatarURL()}`)
        .setThumbnail(searchData.attributes.posterImage.small)
        .addField('❯ Volumes', searchData.attributes.volumeCount, true)
        .addField('❯ Total Chapers', searchData.attributes.chapterCount, true)
        .addField('❯ Rating', `${searchData.attributes.averageRating}%`, true)

      msg.channel.send({ embed })
        .then(msg.delete())
        .then(m.delete())
    } catch (e) {
      signale.error({ prefix: '[Manga Query]', message: e.message })
      return m.edit(`${ohNo} Couldn't find that manga...`).then(msg.delete(), m.delete({ timeout: 5000 }))
    }
  }
}
module.exports = MangaCommand
