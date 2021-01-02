const { Command } = require('discord-akairo')
const booru = require('../../../helpers/booru')

class Rule34Command extends Command {
  constructor () {
    super('rule34', {
      aliases: ['rule34', 'r34'],
      category: 'nsfw',
      args: [
        {
          id: 'searchTerm',
          match: 'content',
          prompt: {
            start: 'What do you lookup on Rule34?'
          }
        }
      ],
      description: {
        content: 'Search for a random result from rule34.xxx.',
        type: 'rest',
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
    const m = await msg.channel.send(`${loading} **Looking for ${searchTerm} on rule34.xxx.**`)

    const search = await searchTerm.split(' ').join('_')
    const searchData = await booru.r34(search)

    if (searchData === undefined) return m.edit(`${ohNo} Your dreams were too big and I couldn't find ${searchTerm}.`).then(m.delete({ timeout: 5000 })).then(msg.delete())

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(searchData.fileUrl)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setImage(searchData.fileUrl)
      .setFooter(`Requested by ${msg.author.tag} | rule34.xxx API`, `${msg.author.displayAvatarURL()}`)

    msg.channel.send({ embed })
      .then(msg.delete())
      .then(m.delete())
  }
}
module.exports = Rule34Command
