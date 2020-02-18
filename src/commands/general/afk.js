const Akairo = require('discord-akairo')
const {
  Command
} = Akairo
// const Discord = require('discord.js')

class AFKCommand extends Command {
  constructor() {
    super('afk', {
      aliases: ['afk'],
      category: 'general',
      channelRestriction: 'guild',
      cooldown: 2000,
      ratelimit: 1,
      description: {
        content: 'Let others know you are afk.',
        examples: ['afk']
      }
    })
  }

  async exec(msg) {
    if (!msg.guild) return msg.channel.send('This command must be used in a guild.')
    if (!msg.guild.usersAFK) msg.guild.usersAFK = []
    if (msg.guild.usersAFK.includes(msg.author.id)) return

    msg.guild.usersAFK.push(msg.author.id)

    const embed = this.client.util.embed()
      .setColor(process.env.EMBED)
      .setDescription(`${msg.author} your now set as AFK, should someone message you I'll let them know. AFK mode is disabled as soon as you send a message anywhere`)
      .setTimestamp()
      .setFooter(`Requested by ${msg.author.tag}`, `${msg.author.displayAvatarURL()}`)

    await msg.channel.send({
      embed
    })
  }
}
module.exports = AFKCommand
