const { Command } = require('discord-akairo')
const { get } = require('snekfetch')

class ComplimentCommand extends Command {
  constructor () {
    super('compliment', {
      aliases: ['compliment'],
      category: 'fun',
      channel: 'guild',
      cooldown: 3000,
      ratelimit: 2,
      args: [
        {
          id: 'member',
          type: 'user',
          prompt: {
            start: 'Who would you like to compliment?',
            retry: 'Please enter a valid user'
          }
        }
      ],
      description: {
        content: 'Compliment a user',
        useage: '<prefix>',
        examples: ['@User']
      }
    })
  }

  async exec (msg, { member }) {
    const loading = await this.client.emojis.get('541151509946171402')
    const ohNo = await this.client.emojis.get('541151482599440385')

    let m = await msg.channel.send(`${loading} looking for a heart warming compliment!`)

    const { body } = await get(`https://complimentr.com/api`)
    console.log(body.compliment)
    if (!body.compliment) return msg.util.reply(`${ohNo} There seems to be a problem sorry.`).then(msg.delete())

    m.edit(`${member}, ${body.compliment}!`).then(msg.delete())
  }
}
module.exports = ComplimentCommand
