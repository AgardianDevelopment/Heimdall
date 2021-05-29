const { Command } = require('discord-akairo')
const drep = require('../../helpers/drep')

class DisRepCommand extends Command {
  constructor () {
    super('disrep', {
      aliases: ['disrep', 'drep'],
      category: 'reputation',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      args: [
        {
          id: 'member',
          type: 'user',
          default: message => message.author,
          prompt: {
            start: 'That user could not be found. Whose reputation would you like to view?',
            retry: 'Please provide a valid user.',
            optional: true
          }
        }
      ],
      description: {
        content: 'Shows a user\'s reputation from DiscordRep.',
        usage: '<user> [page]',
        examples: ['@JimBob', 'PopularDude#4232 10']
      }
    })

    this.perPage = 5
  }

  async exec (msg, { member }) {
    // Loading emojis from emoji server
    const loading = await this.client.emojis.resolve(process.env.LOADING)

    // Send default pending message
    const m = await msg.channel.send(`${loading} **Checking DiscordRep for this user**`)

    // Calling API for User's Rep
    const searchData = await drep.reputation(member)

    // Build embeded message
    const embed = this.client.util.embed()
      .setTitle('DiscordRep Results')
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setThumbnail('https://discordrep.com/favicon.png')
      .setFooter(`Requested by ${msg.author.tag} | DiscordRep API`, `${msg.author.displayAvatarURL()}`)
      .addField(`${member.tag}`, [
        `**❯ Upvotes**: ${searchData.upvotes}`,
        `**❯ Downvotes**: ${searchData.downvotes}`,
        `**❯ XP**: ${searchData.xp}`,
        `**❯ Rank**: ${searchData.rank}`
      ])
      .addField('DiscordRep Link', `https://discordrep.com/u/${member.id}`)
    // Send edited embed message
    msg.channel.send({ embed })
      .then(msg.delete())
      .then(m.delete())
  }
}

module.exports = DisRepCommand
