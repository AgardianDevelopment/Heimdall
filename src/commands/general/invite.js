const { Command } = require('discord-akairo')

class InviteCommand extends Command {
  constructor () {
    super('invite', {
      aliases: ['invite'],
      category: 'general',
      clientPermissions: ['EMBED_LINKS'],
      description: { content: 'Gets the bot invite for Heimdall.' }
    })
  }

  async exec (message) {
    // Build Embed
    const embed = this.client.util.embed()
      .setColor(process.env.EMBED)
      .setDescription('**[Add Heimdall to your server!](https://discord.com/oauth2/authorize?client_id=391050398850613250&scope=bot&permissions=537390278)**')

    return message.util.send({ embed })
  }
}

module.exports = InviteCommand
