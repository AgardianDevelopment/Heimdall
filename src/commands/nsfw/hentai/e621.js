const { Command } = require('discord-akairo')
const Booru = require('booru')

class E61Command extends Command {
  constructor () {
    super('e621', {
      aliases: ['e621', 'yiff'],
      category: 'nsfw',
      args: [
        {
          id: 'searchTerm',
          prompt: {
            start: 'What do you lookup on e621?'
          }
        }
      ],
      description: {
        content: 'Search for a random result from e621.'
      },
      cooldown: 3000,
      ratelimit: 2
    })
  }

  async exec (msg, { searchTerm }) {
    const nsfwMode = this.client.settings.get(msg.guild.id, 'nsfw', [])
    if (nsfwMode != true || !msg.channel.nsfw) return msg.util.reply(':underage: We gotta go someplace NSFW for this sorta thing.')

    const loading = await this.client.emojis.resolve('541151509946171402')
    const ohNo = await this.client.emojis.resolve('541151482599440385')
    const m = await msg.channel.send(`${loading} **Time to look for some ${searchTerm}.**`)

    const blacklist = ['loli', 'shota', 'cub', 'young', 'child', 'baby']

    const result = await Booru.search('e621.net', searchTerm, { limit: 1, random: true })

    if (!result) return m.edit(`${ohNo} Looks like your dreams were too big.`)

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(`https://e621.net/post/show/${result[0].data.id}`)
      .setDescription(`**Artist:** ${result[0].data.author}\n**Description:** ${result[0].data.description.substring(0, 450)}...`)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setImage(result[0].data.file_url)
      .setFooter(`Requested by ${msg.author.tag} | e621 API`, `${msg.author.displayAvatarURL()}`)

    m.edit({ embed }).then(msg.delete())
  }
}
module.exports = E61Command
