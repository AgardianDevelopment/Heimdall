const { Command } = require('discord-akairo')
const guildSettings = require('../../models/settings')

class PurgeCommand extends Command {
  constructor () {
    super('purge', {
      aliases: ['purge', 'clear', 'clean'],
      category: 'moderation',
      channel: 'guild',
      userPermissions: ['MANAGE_MESSAGES'],
      args: [
        {
          id: 'limit',
          type: 'number',
          prompt: {
            start: 'How many messages would you like to delete (1-99)?',
            retry: 'Please enter a number between 1 and 99.'
          }
        }
      ],
      description: {
        content: [
          'Purges a selected amount of messages. Adjust for amount + 1 for command.'
        ],
        useage: '<prefix>',
        examples: ['25']
      }
    })
  }

  async exec (msg, { limit }) {
    // Set hard limit on amount of messages to purge
    if (limit > 99) {
      return msg.util.reply('Please try again with a number between 1 and 99')
    }

    // Fetch amount of messages and delete, add +1 for the command message
    const fetched = await msg.channel.messages.fetch({ limit: limit + 1 })
    msg.channel.bulkDelete(fetched.array().reverse()).catch(err => msg.util.reply(`Messages not deleted due to error: ${err}`))

    // Fetch log channel and save to variable, send response if not found.
    const logChan = this.client.settings.get(msg.guild.id, 'logChannel', [])
    if (Object.entries(logChan).length === 0) return msg.util.reply(`${fetched.size - 1} of ${limit} messages deleted.`).then(msg => { msg.delete({ timeout: 5000 }) })
    const logSend = msg.guild.channels.resolve(logChan)

    // Increment case count
    const guildID = await guildSettings.findOne({ where: { guildID: msg.guild.id } })
    guildID.increment('caseNumber')

    // Create embed and send
    const embed = this.client.util.embed()
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setFooter(`Case: ${guildID.caseNumber} | Recorded by ${msg.author.tag}`, `${msg.author.displayAvatarURL()}`)
      .addField('Messages Purged', [
        `**Requested Purge**: ${limit}`,
        `**Actual Purge**: ${fetched.size}`
      ])

    logSend.send({ embed })
  }
}
module.exports = PurgeCommand
