const { Command } = require('discord-akairo')
const fetch = require('node-fetch')

class InsultCommand extends Command {
  constructor () {
    super('insult', {
      aliases: ['insult'],
      category: 'fun',
      channel: 'guild',
      cooldown: 3000,
      ratelimit: 2,
      args: [
        {
          id: 'member',
          type: 'user',
          prompt: {
            start: 'Who would you like to insult?',
            retry: 'Please enter a valid user'
          }
        }
      ],
      description: {
        content: 'Insult a user',
        useage: '<prefix>',
        examples: ['@User']
      }
    })
  }

  async exec (msg, { member }) {
    // Load Emojis from server
    const loading = await this.client.emojis.resolve(process.env.LOADING)
    const ohNo = await this.client.emojis.resolve(process.env.CROSS)

    const m = await msg.channel.send(`${loading} looking for a savage insult!`)

    // Query API for insult response and format
    const res = await fetch('https://evilinsult.com/generate_insult.php?lang=en&type=json').then(res => res.json())
    if (!res) return msg.util.reply(`${ohNo} There seems to be a problem sorry.`).then(msg.delete())
    const insult = res.insult
    const insultRes = insult.toLowerCase()

    m.edit(`${member}, ${insultRes}.`).then(msg.delete())
  }
}
module.exports = InsultCommand
