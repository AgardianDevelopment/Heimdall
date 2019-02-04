const { Command } = require('discord-akairo')
const guildSettings = require('../../models/settings')

class PurgeCommand extends Command {
  constructor () {
    super('purge', {
      aliases: ['purge'],
      category: 'moderation',
      channel: 'guild',
      userPermissions: ['MANAGE_MESSAGES'],
      args: [
        {
          id: 'limit',
          type: 'number',
          prompt: {
            start: 'How many messages would you like to delete (1-100)?',
            retry: 'Please enter a number between 1 and 100.'
          }
        }
      ],
      description: {
        content: [
          'Purges a selected amount of messages.'
        ],
        useage: '<prefix>',
        examples: ['25']
      }
    })
  }

  async exec (msg, { limit }) {
    if (limit < 1 || limit > 100) {
      return msg.util.reply('Please try again with a number between 1 and 100')
    }

    const fetched = await msg.channel.messages.fetch({ limit: limit + 1 })
    msg.channel.bulkDelete(fetched.array().reverse()).catch(err => msg.util.reply(`Messages not deleted due to error: ${err}`))

    const logChan = this.client.settings.get(msg.guild.id, 'logChannel', [])
    const logSend = msg.guild.channels.get(logChan)

    const guildID = await guildSettings.findOne({ where: { guildID: msg.guild.id } })
    guildID.increment('caseNumber')

    const embed = this.client.util.embed()
      .setColor(0xfacb3e)
      .setTimestamp()
      .setFooter(`Case: ${guildID.caseNumber} | Recorded by ${msg.author.tag}`, `${msg.author.displayAvatarURL()}`)
      .addField('Messages Purged :scissors:', [
        `**Requested Purge**: ${limit + 1}`,
        `**Actual Purge**: ${fetched.size}`
      ])

    logSend.send({ embed })
  }
}
module.exports = PurgeCommand
