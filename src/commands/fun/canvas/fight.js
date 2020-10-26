const { Command } = require('discord-akairo')
const fetch = require('node-fetch')

class FightCommand extends Command {
  constructor () {
    super('fight', {
      aliases: ['fight', 'www'],
      category: 'fun',
      args: [
        {
          id: 'user1',
          type: 'user',
          prompt: {
            start: 'Who is the first member to fight?',
            retry: 'Please enter a valid user.'
          }
        },
        {
          id: 'user2',
          type: 'user',
          prompt: {
            start: 'Who is the second member to fight?',
            retry: 'Please enter a valid user'
          }
        }
      ],
      description: {
        content: 'Set some users against each other.',
        useage: '<prefix>',
        examples: ['[user1] [user2]']
      },
      cooldown: 3000,
      ratelimit: 2
    })
  }

  async exec (msg, { user1, user2 }) {
    // Load Emojis from server
    const loading = await this.client.emojis.resolve(process.env.LOADING)

    const m = await msg.channel.send(`${loading} **Setting up the match**`)

    var ship1 = msg.guild.member(user1)
    var ship2 = msg.guild.member(user2)

    // Set variables for user avatars to post
    var avatar1 = user1.displayAvatarURL({ format: 'jpg' })
    var avatar2 = user2.displayAvatarURL({ format: 'jpg' })

    const res = await fetch(`https://nekobot.xyz/api/imagegen?type=whowouldwin&user1=${avatar1}&user2=${avatar2}`).then(res => res.json())

    const embed = this.client.util.embed()
      .setTitle(`${ship1.user.username} vs ${ship2.user.username}!`)
      .setURL(res.message)
      .setColor(process.env.EMBED)
      .setTimestamp()
      .setImage(res.message)
      .setFooter(`Requested by ${msg.author.tag} | NekoBot API`, `${msg.author.displayAvatarURL()}`)

    m.edit({ embed }).then(msg.delete())
  }
}
module.exports = FightCommand
