const { Command } = require('discord-akairo')
const booru = require('../../helpers/booru')
const Perms = require('../../models/hiddenPerms.js')

class AngelCommand extends Command {
  constructor () {
    super('angel', {
      aliases: ['angel'],
      category: 'hidden',
      description: {
        content: 'The one-winged angel approaches uwu'
      },
      cooldown: 5000,
      ratelimit: 2
    })
  }

  async exec (msg) {
    const nsfwMode = this.client.settings.get(msg.guild.id, 'nsfw', [])
    if (!nsfwMode || nsfwMode === false || !msg.channel.nsfw) return msg.util.reply(':underage: We gotta go someplace NSFW for this sorta thing.')

    const permission = await Perms.findAll({ where: { userID: msg.author.id, angel: 'true' } })

    const insult = [
      'Face it, all you are is an empty puppet.',
      'Tell me what you cherish most. Give me the pleasure of taking it away.',
      'On your knees; I want you to beg for forgiveness!',
      'Kneel down and show me the sight of you begging for mercy.',
      'I\'ve thought of a wonderful present for you... Shall I give you despair?',
      'Your Geostigma is gone. That\'s too bad.',
      'Is this the pain you felt before? Let me remind you. This time, you won\'t forget.'
    ]

    if (permission.length === 0) return msg.channel.send(insult[Math.floor(Math.random() * insult.length)]).then(msg.delete())

    const loading = await this.client.emojis.resolve(process.env.LOADING)
    const ohNo = await this.client.emojis.resolve(process.env.CROSS)

    const m = await msg.channel.send(`${loading} **Booting god protocol!**`)

    const searchData = await booru.r34('sephiroth male_only')

    if (searchData === undefined) return m.edit(`${ohNo} Something went wrong, try again.`).then(m.delete({ timeout: 5000 })).then(msg.delete())

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(searchData.fileUrl)
      .setColor(process.env.EMBED)
      .setImage(searchData.fileUrl)
      .setFooter('Requested by REDACTED | via REDACTED • REDATED at XX:XX GMT', 'https://i.imgur.com/GfqYVlU.png')

    msg.channel.send({ embed })
      .then(msg.delete())
      .then(m.delete())
  }
}
module.exports = AngelCommand
