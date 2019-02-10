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
    const asgard = this.client.guilds.get('540671346728763392')

    const embed = this.client.util.embed()
      .setColor(process.env.EMBED)
      .setTitle('About Heimdallr')
      .setDescription([
        `Heimdallr is developed by **${asgard}** and is a fork of Hoshi by **1computer1** and **vzwgrey**.`,
        '',
        'Heimdallr uses the **[Discord.js](https://discord.js.org)** library and the **[Akairo](https://1computer1.github.io/discord-akairo)** framework.',
        'You can find our more on our **[wiki](https://github.com/AgardianDevelopment/heimdall/wiki)**.',
        '',
        `Use \`${prefix}stats\` for statistics and \`${prefix}invite\` for an invite link.`,
        '',
        'Join the community server [server](https://discord.gg/E9cJjvw) to learn more!'
      ])

    return message.util.send({ embed })
  }
}

module.exports = AboutCommand
