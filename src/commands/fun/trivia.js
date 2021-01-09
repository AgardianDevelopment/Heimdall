const { Command } = require('discord-akairo')
const funHelper = require('../../helpers/funHelper')
const signale = require('signale')
const shuffle = require('shuffle-array')
const he = require('he')

class TriviaCommand extends Command {
  constructor () {
    super('trivia', {
      aliases: ['trivia'],
      category: 'fun',
      cooldown: 5000,
      ratelimit: 1,
      args: [
        {
          id: 'category',
          type: ['games', 'animals', 'general', 'movies', 'anime', 'animation', 'music'],
          prompt: {
            start: 'Trivia based on animals, games, or general.',
            retry: 'Please enter a valid category.'
          }
        }
      ],
      description: {
        content: 'Play trivia based on multiple categories.',
        useage: '<prefix>',
        examples: ['games', 'animals', 'movies', 'anime', 'animation', 'music', 'general']
      }
    })
  }

  async exec (msg, { category }) {
    // Load Emojis from server
    const loading = await this.client.emojis.resolve(process.env.LOADING)
    const ohNo = await this.client.emojis.resolve(process.env.CROSS)
    const check = await this.client.emojis.resolve(process.env.CHECK)
    const sent = await msg.channel.send(`${loading} **Grabbing your trivia...**`)

    try {
      const searchResults = await funHelper.trivia(category)

      const question = searchResults.question
      var answers = [he.decode(searchResults.correct_answer), he.decode(searchResults.incorrect_answers[0]), he.decode(searchResults.incorrect_answers[1]), he.decode(searchResults.incorrect_answers[2])]
      shuffle(answers)

      const embed = this.client.util.embed()
        .setTitle(searchResults.category)
        .setDescription('Please select the correct answer via 1-4')
        .setColor(process.env.EMBED)
        .setTimestamp()
        .setFooter(`Requested by ${msg.author.tag} | OpenTDB API`, `${msg.author.displayAvatarURL()}`)
        .addField('Question:', he.decode(question))
        .addField('Answers:', [
        `1: ${(answers[0])}`,
        `2: ${answers[1]}`,
        `3: ${answers[2]}`,
        `4: ${answers[3]}`
        ])

      await sent.edit({ embed }).then(msg.delete())
      const filter = m => m.author.id === msg.author.id
      const attempts = await msg.channel.awaitMessages(filter, { time: 15000, max: 1 })

      // Response if user times out
      if (!attempts || !attempts.size) {
        await sent.edit({ embed: null })
        return msg.channel.send(`${ohNo} You ran out of time it was **${he.decode(searchResults.correct_answer)}**.`)
      }

      // Format user's response
      const answer = attempts.first().content.toLowerCase()
      const index = Number(answer) - 1

      // Check if answer is correct or not then send response
      if (answers[index].toLowerCase() === he.decode(searchResults.correct_answer.toLowerCase())) {
        await sent.edit({ embed: null })
        return msg.channel.send(`${check} You answered correctly with **${he.decode(searchResults.correct_answer)}**`)
      } else {
        await sent.edit({ embed: null })
        return msg.channel.send(`${ohNo} You answered incorrectly, It was **${he.decode(searchResults.correct_answer)}**`)
      }
    } catch (err) {
      signale.error({ prefix: '[Trivia]', message: err.message })
      return sent.edit(`${ohNo} Couldn't find a trivia question...`).then(msg.delete(), sent.delete({ timeout: 5000 }))
    }
  }
}
module.exports = TriviaCommand
