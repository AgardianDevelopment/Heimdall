const { Command } = require('discord-akairo')
const ms = require('ms')
const guildSettings = require('../../models/settings')

class LockDownCommand extends Command {
  constructor () {
    super('lockdown', {
      aliases: ['lockdown', 'lock'],
      category: 'moderation',
      channel: 'guild',
      userPermissions: 'MANAGE_CHANNELS',
      args: [
        {
          id: 'duration',
          match: 'rest',
          prompt: {
            start: 'How long should I lockdown the channel (h, m, s)?',
            retry: 'Please enter a valid amount of time.'
          }
        }
      ],
      description: {
        content: 'Lockdown a text chat channel.',
        useage: '<prefix>',
        examples: ['15s', '15m', '2h']
      }
    })
  }

  async exec (msg, { duration }) {
    if (!msg.lockit) msg.lockit = []
    let time = duration
    let validUnlocks = ['release', 'unlock']

    if (validUnlocks.includes(time)) {
      msg.channel.overwritePermissions(msg.guild.id, {
        SEND_MESSAGES: null
      }).then(() => {
        msg.channel.send('**Lockdown lifted.**')
        clearTimeout(msg.lockit[msg.channel.id])
        delete msg.lockit[msg.channel.id]
      }).catch(error => {
        console.log(error)
      })
    } else {
      msg.channel.overwritePermissions(msg.guild.id, {
        SEND_MESSAGES: false
      }).then(() => {
        msg.channel.send(`**Channel locked down for ${ms(ms(time), { long: true })}**`).then(() => {
          msg.lockit[msg.channel.id] = setTimeout(() => {
            msg.channel.overwritePermissions(msg.guild.id, {
              SEND_MESSAGES: null
            }).then(msg.channel.send('**Lockdown lifted.**')).catch(console.error)
            delete msg.lockit[msg.channel.id]
          }, ms(time))
        }).catch(error => {
          console.log(error)
        })
      })
    }

    const logChan = this.client.settings.get(msg.guild.id, 'logChannel', [])
    if (!logChan) return msg.author.send(`Lockdown has been set for ${ms(ms(time), { long: true })}`)
    const logSend = msg.guild.channels.get(logChan)

    const guildID = await guildSettings.findOne({ where: { guildID: msg.guild.id } })
    guildID.increment('caseNumber')

    const embed = this.client.util.embed()
      .setColor(0xfacb3e)
      .setTimestamp()
      .setFooter(`Case: ${guildID.caseNumber} | Recorded by ${msg.author.tag}`, `${msg.author.displayAvatarURL()}`)
      .addField('Channel Lockdown', [
        `**Channel**: ${msg.channel}`,
        `**Length**: ${ms(ms(time), { long: true })}`
      ])

    logSend.send({ embed })
  }
}
module.exports = LockDownCommand
