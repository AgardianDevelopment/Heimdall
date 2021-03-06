const { Command } = require('discord-akairo')
const guildSettings = require('../../models/settings')

class BanCommand extends Command {
  constructor () {
    super('ban', {
      aliases: ['ban'],
      category: 'moderation',
      channel: 'guild',
      userPermissions: ['BAN_MEMBERS'],
      args: [
        {
          id: 'member',
          type: 'user',
          prompt: {
            start: 'What user would you like to ban?',
            retry: 'Please enter a valid user.'
          }
        },
        {
          id: 'reason',
          match: 'rest',
          prompt: {
            start: 'What is your reason for banning this member?',
            retry: 'Please enter a valid reason'
          }
        }
      ],
      description: {
        content: 'Bans a user from the server.',
        useage: '<prefix>',
        exmaples: ['@User [reason]']
      }
    })
  }

  async exec (msg, { member, reason }) {
    // Fetch guild member and ban
    const guildMember = msg.guild.member(member)
    guildMember.ban().catch(console.error)

    // Fetch log channel and save to variable, send response if not found.
    const logChan = this.client.settings.get(msg.guild.id, 'logChannel', [])
    if (Object.entries(logChan).length === 0) return msg.util.reply(`${member.tag} has been banned.`).then(msg.delete({ timeout: 5000 }))
    const logSend = msg.guild.channels.resolve(logChan)

    // Increment case count
    const guildID = await guildSettings.findOne({ where: { guildID: msg.guild.id } })
    guildID.increment('caseNumber')

    // Build embed and send
    const embed = this.client.util.embed()
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setFooter(`Case: ${guildID.caseNumber} | Recorded by ${msg.author.tag}`, `${msg.author.displayAvatarURL()}`)
      .addField('User Banned', [
        `**User**: ${member.tag}`,
        `**User ID**: ${member.id}`,
        `**Reason**: ${reason}`
      ])

    logSend.send({ embed })
  }
}
module.exports = BanCommand
