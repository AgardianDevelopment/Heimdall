const { Command } = require('discord-akairo')
const { get } = require('snekfetch')

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
    if (!nsfwMode || nsfwMode === false || !msg.channel.nsfw) return msg.util.reply(':underage: We gotta go someplace NSFW for this sorta thing.')

    const loading = await this.client.emojis.get('541151509946171402')
    const ohNo = await this.client.emojis.get('541151482599440385')
    let m = await msg.channel.send(`${loading} **Time to look for some ${searchTerm}.**`)

    const blacklist = ['loli', 'shota', 'cub', 'young', 'child', 'baby']

    const { body } = await get(`https://e621.net/post/index.json?limit=100&tags=${encodeURI(searchTerm)}`)
    const i = Math.floor(Math.random() * body.length)
    const result = body[i]
    if (!result) return m.edit(`${ohNo} Looks like your dreams were too big.`)

    if (result.tags.split(' ').some(t => blacklist.includes(t.toLowerCase()))) return m.edit(`${ohNo} Blacklisted word found, how about we dont...`)

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(`https://e621.net/post/show/${result.id}`)
      .setDescription(`Created by ${result.artist[0]}\n**Description:** ${result.description.substring(0, 450)}...`)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setImage(result.file_url)
      .setFooter(`Requested by ${msg.author.tag} | via e621`, `${msg.author.displayAvatarURL()}`)

    m.edit({ embed })
  }
}
module.exports = E61Command
