const { Command } = require('discord-akairo')
const Starboard = require('../../struct/Starboard')

class SettingsCommand extends Command {
  constructor () {
    super('settings', {
      aliases: ['settings', 'view-settings'],
      category: 'general',
      channel: 'guild',
      clientPermissions: ['EMBED_LINKS'],
      description: { content: 'Displays the guild\'s current settings.' }
    })
  }

  exec (msg) {
    const prefix = this.handler.prefix(msg)
    const defaultRole = this.client.settings.get(msg.guild.id, 'defaultRole', [])
    const emojiID = this.client.settings.get(msg.guild, 'emoji', '⭐')
    const starboard = this.client.starboards.get(msg.guild.id)
    const logChan = this.client.settings.get(msg.guild.id, 'logChannel', [])
    const newsChan = this.client.settings.get(msg.guild.id, 'newsChannel', [])
    const blacklist = this.client.settings.get(msg.guild, 'blacklist', [])
    const nsfw = this.client.settings.get(msg.guild, 'nsfw', [])

    const logName = msg.guild.channels.get(logChan)
    const newsName = msg.guild.channels.get(newsChan)
    const roleName = msg.guild.roles.get(defaultRole)

    console.log(newsChan)

    const embed = this.client.util.embed()
      .setColor(process.env.EMBED)
      .setTitle('Settings')
      .setDescription([
        `**Prefix**: \`${prefix}\``,
        `**Default Role:** ${(roleName) || 'None'}`,
        `**Log Channel**: ${(logName) || 'None'}`,
        `**Annoucement Channel**: ${(newsName) || 'None'}`,
        `**Emoji**: ${Starboard.emojiFromID(this.client, emojiID)}`,
        `**Starboard**: ${(starboard && starboard.channel) || 'None'}`,
        `**Threshold**: ${(starboard && starboard.threshold) || 'None'}`,
        `**Blacklist**: ${blacklist.join(', ') || 'None'}`,
        `**NSFW Mode**: \`${nsfw}\``
      ])
      .setTimestamp()
      .setFooter(`Requested by ${msg.author.tag}`, `${msg.author.displayAvatarURL()}`)

    return msg.util.send({ embed })
  }
}

module.exports = SettingsCommand
