const { Command } = require('discord-akairo')
const funHelper = require('../../helpers/funHelper')
const signale = require('signale')

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

    try {
      const searchData = await funHelper.insult()
      m.edit(`${member}, ${searchData}`).then(msg.delete())
    } catch (err) {
      signale.error({ prefix: '[Insult]', message: err.message })
      return m.edit(`${ohNo} Couldn't find a sick enough burn...`).then(msg.delete(), m.delete({ timeout: 5000 }))
    }
  }
}
module.exports = InsultCommand
