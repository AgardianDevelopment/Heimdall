const { Argument, Command } = require('discord-akairo')
const fetch = require('node-fetch')

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
    // Fetch guild member
    const guildMember = msg.guild.member(member)

    // Loading emojis from emoji server
    const loading = await this.client.emojis.resolve(process.env.LOADING)

    // Send default pending message
    const m = await msg.channel.send(`${loading} **Checking DiscordRep for this user**`)

    // Calling API for User's Rep
    var requestOptions = {
      method: 'get',
      headers: {
        Accept: 'application/json',
        Authorization: process.env.DREP
      },
      redirect: 'follow'
    }

    var userRep = await fetch(`https://discordrep.com/api/v3/rep/${guildMember.id}`, requestOptions).then(res => res.json())

    // Build embeded message
    const embed = this.client.util.embed()
      .setTitle('DiscordRep Results')
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setThumbnail('https://discordrep.com/favicon.png')
      .setFooter(`Requested by ${msg.author.tag} | DiscordRep API`, `${msg.author.displayAvatarURL()}`)
      .addField(`${member.tag}`, [
        `**❯ Upvotes**: ${userRep.upvotes}`,
        `**❯ Downvotes**: ${userRep.downvotes}`,
        `**❯ XP**: ${userRep.xp}`,
        `**❯ Rank**: ${userRep.rank}`
      ])
      .addField('DiscordRep Link', `https://discordrep.com/u/${member.id}`)
    // Send edited embed message
    m.edit({ embed }).then(msg.delete())
  }
}

module.exports = DisRepCommand
