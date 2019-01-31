const { Command } = require('discord-akairo')

class AboutCommand extends Command {
  constructor () {
    super('about', {
      aliases: ['about', 'info'],
      category: 'general',
      clientPermissions: ['EMBED_LINKS'],
      description: { content: 'Shows information about Heimdall.' }
    })
  }

  exec (message) {
    const prefix = this.handler.prefix(message)
    const asgard = this.client.guilds.get('266192846623604736')
    const vulgar = this.client.users.get('101808227385098240')

    const embed = this.client.util.embed()
      .setColor(0xFFAC33)
      .setTitle('About Heimdall')
      .setDescription([
        `Heimdall is developed by **${asgard.name}** and is a fork of Hoshi by **1computer1** and **vzwgrey**.`,
        '',
        'Heimdall uses the **[Discord.js](https://discord.js.org)** library and the **[Akairo](https://1computer1.github.io/discord-akairo)** framework.',
        'You can find the Github repo for Heimdall **[here](https://github.com/1Computer1/Heimdall)**.',
        '',
        `Use \`${prefix}stats\` for statistics and \`${prefix}invite\` for an invite link.`
      ])

    return message.util.send({ embed })
  }
}

module.exports = AboutCommand
