const { Command } = require('discord-akairo')
const delay = require('delay')
const guildSettings = require('../../models/settings')

class AcceptCommand extends Command {
  constructor () {
    super('accept', {
      aliases: ['accept'],
      category: 'general',
      channel: 'guild',
      description: {
        content: 'Used to accept server requirements if desired.',
        useage: '<prefix>'
      }
    })
  }

  async exec (msg) {
    msg.delete()
    const defRole = this.client.settings.get(msg.guild.id, 'defaultRole', [])
    if (!defRole) return msg.util.reply('Your server does not make use of this feature.')
    let guildMember = msg.guild.member(msg.author)
    guildMember.roles.add(defRole).catch(console.error)

    const logChan = this.client.settings.get(msg.guild.id, 'logChannel', [])
    if (!logChan) return msg.util.reply(`Thank you, you now have access to the server.`)
    const logSend = msg.guild.channels.get(logChan)

    const guildID = await guildSettings.findOne({ where: { guildID: msg.guild.id } })
    guildID.increment('caseNumber')

    const embed = this.client.util.embed()
      .setColor(0xfacb3e)
      .setTimestamp()
      .setFooter(`Case: ${guildID.caseNumber} | Recorded by ${msg.author.tag}`, `${msg.author.displayAvatarURL()}`)
      .addField('Rule Acceptance', `${msg.author.tag} has accepted the server rules.`)

    msg.util.reply(`Thank you, you now have access to the server.`).then(async botMsg => {
      await delay(5000)
      botMsg.delete({ limit: 5000 })
    })
    logSend.send({ embed })
  }
}
module.exports = AcceptCommand
