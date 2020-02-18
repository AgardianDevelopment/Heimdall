const { Inhibitor } = require('discord-akairo')
const Logger = require('../util/Logger')

class MessageInhibitor extends Inhibitor {
  constructor() {
    super('messages', {
      reaons: 'messages',
      type: 'all'
    })
  }

  async exec(message) {
    try {
      /**
       * AFK
       */
      var afkReasons = require('../assets/afkReasons.json')
      let response = afkReasons[Math.floor(Math.random() * afkReasons.length)]
      if (message.guild.usersAFK) {
        if (message.guild.usersAFK.includes(message.author.id)) {
          message.guild.usersAFK.splice(message.guild.usersAFK.indexOf(message.author.id), 1)
        }

        let usersAFK = message.mentions.users.filter(user => message.guild.usersAFK.includes(user.id) && message.channel.permissionsFor(user).has('MANAGE_GUILD'))
        for (let user of usersAFK) {
          user = user[1]
          message.channel.send(`**${user.tag}** ${response}`).catch(() => { })
        }
      }
    } catch (err) {
      return Logger.error('Heimdall has had an error with the message.js inhibitor')
    }
  }
}

module.exports = MessageInhibitor
