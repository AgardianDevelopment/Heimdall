const { Command } = require('discord-akairo')
const booru = require('../../../helpers/booru')

class E621Command extends Command {
  constructor () {
    super('e621', {
      aliases: ['e621', 'yiff'],
      category: 'nsfw',
      args: [
        {
          id: 'searchTerm',
          match: 'content',
          prompt: {
            start: 'What do you lookup on e621?'
          }
        }
      ],
      description: {
        content: 'Search for a random result from e621.',
        usage: '[search term]',
        examples: ['red panda']
      },
      cooldown: 3000,
      ratelimit: 2
    })
  }

  async exec (msg, { searchTerm }) {
    const nsfwMode = this.client.settings.get(msg.guild.id, 'nsfw', [])
    if (nsfwMode !== true || !msg.channel.nsfw) return msg.util.reply(':underage: We gotta go someplace NSFW for this sorta thing.')

    const loading = await this.client.emojis.resolve(`${process.env.LOADING}`)
    const ohNo = await this.client.emojis.resolve(`${process.env.CROSS}`)
    const m = await msg.channel.send(`${loading} **Looking for ${searchTerm} on e621.net.**`)

    const search = await searchTerm.split(' ').join('_')
    const searchData = await booru.e621(search)

    if (searchData === undefined) return m.edit(`${ohNo} Your dreams were too big and I couldn't find ${searchTerm}.`).then(m.delete({ timeout: 5000 })).then(msg.delete())

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(searchData.fileUrl)
      .setDescription(`**Artist:** ${searchData.data.tags.artist}`)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setImage(searchData.fileUrl)
      .setFooter(`Requested by ${msg.author.tag} | e621.net API`, `${msg.author.displayAvatarURL()}`)

    msg.channel.send({ embed })
      .then(msg.delete())
      .then(m.delete())
  }
}
module.exports = E621Command
