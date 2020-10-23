const { Command } = require('discord-akairo')
const booru = require('../../../helpers/booru')

class GelBooruCommand extends Command {
  constructor () {
    super('gelbooru', {
      aliases: ['gelbooru', 'gel'],
      category: 'nsfw',
      args: [
        {
          id: 'searchTerm',
          match: 'content',
          prompt: {
            start: 'What do you lookup on gelbooru?'
          }
        }
      ],
      description: {
        content: 'Search for a random result from gelbooru.com.',
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
    const m = await msg.channel.send(`${loading} **Looking for ${searchTerm} on gelbooru.com.**`)

    const search = await searchTerm.split(' ').join('_')
    const searchData = await booru.gelbooru(search)
    console.log(searchData)

    if (searchData === undefined) return m.edit(`${ohNo} Your dreams were too big and I couldn't find ${searchTerm}.`).then(m.delete({ timeout: 5000 })).then(msg.delete())

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(searchData.fileUrl)
      .setDescription(`**Artist:** ${searchData.data.owner}`)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setImage(searchData.fileUrl)
      .setFooter(`Requested by ${msg.author.tag} | gelbooru.com API`, `${msg.author.displayAvatarURL()}`)

    msg.channel.send({ embed })
      .then(msg.delete())
      .then(m.delete())
  }
}
module.exports = GelBooruCommand
