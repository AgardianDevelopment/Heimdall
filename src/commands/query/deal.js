/**
 * * Credit to adamdavies001
 * * git: https://github.com/adamdavies001/isthereanydeal-lookup
 */
const { Command } = require('discord-akairo')
const apiUtil = require('../../helpers/itadAPI')

class DealCommand extends Command {
  constructor () {
    super('deal', {
      aliases: ['deal', 'deals'],
      category: 'query',
      cooldown: 2000,
      ratelimit: 1,
      args: [
        {
          id: 'searchTerm',
          match: 'content',
          prompt: {
            start: 'What game would you like to check sales on?',
            retry: 'Please enter a valid game name.'
          }
        }
      ],
      description: {
        content:
          'Checks for any current game deals on isthereanydeal.com',
        useage: '<prefix>',
        examples: ['killing floor 2', 'monster train']
      }
    })
  }

  async exec (msg, { searchTerm }) {
    const game = searchTerm.replace(/[^A-Z0-9]/ig, '')
    const ignoredSellers = ['2game', 'allyouplay', 'bistore', 'dlgamer', 'direct2drive', 'dreamgame', 'fireflower', 'impuse', 'gamesplanet', 'gamesplanetfr', 'gamesplanetus', 'gamesrepublic', 'gemly', 'lbostore', 'nuuvem', 'playism', 'silagames', 'voidu', 'wingamestore', 'gamesplanetde', 'gamesload', 'gamersgate']

    // Load emojis from emoji server
    const loading = await this.client.emojis.resolve('541151509946171402')
    const ohNo = await this.client.emojis.resolve('541151482599440385')

    // Send default pending message
    const m = await msg.channel.send(`${loading} **Checking out isthereanydeal.com...**`)

    try {
      const gameId = await apiUtil.getGameId(game)

      if (!gameId) {
        const gameList = await apiUtil.search(game)

        if (gameList.length > 0) {
          // Map titles, remove duplicates, sort alphabetically
          const titles = gameList
            .map(x => x.title)
            .filter((v, i, a) => a.indexOf(v) === i)
            .sort()

          msg.channel.send(`${ohNo} Could not look up "${searchTerm}".\n\n**Here are some suggestions:**\n${titles.join('\n')}`)
        } else {
          msg.channel.send(`${ohNo} Could not look up "${searchTerm}". Did you spell it correctly?`)
        }

        return
      }

      // Can't rely on user input for the formal game name.
      // Formal name also isn't returned with game data in the next step.
      const gameInfo = await apiUtil.getGameInfo(gameId)
      const gameData = await apiUtil.getGameData(gameId, ignoredSellers)
      const list = gameData.list.filter(x => x.price_new < x.price_old)

      if (!gameData || list.length === 0) {
        msg.channel.send(`${ohNo} There are currently no deals on ${searchTerm}.`)
        return
      }

      const sellers = list.map(x => `[${x.shop.name}](${x.url})`)
      const newPrices = list.map(x => `${toCurrency(x.price_new)} (-${x.price_cut}%)`)
      const oldPrices = list.map(x => toCurrency(x.price_old))

      const histLowData = await apiUtil.getHistoricalLow(gameId)

      const embed = this.client.util.embed()
        .setTitle(gameInfo.title || gameId)
        .setColor(process.env.EMBED)
        .setImage(gameInfo.image)
        .setURL(gameData.urls.game)
        .setTimestamp()
        .setFooter(`Requested by ${msg.author.tag} | ITAD API`, `${msg.author.displayAvatarURL()}`)
        .addField('Seller', sellers.join('\n'), true)
        .addField('New Price', newPrices.join('\n'), true)
        .addField('Old Price', oldPrices.join('\n'), true)

      if (histLowData) {
        embed.addField('Historical Low', `${toCurrency(histLowData.price)} (-${histLowData.cut}%) from ${histLowData.shop.name}`)
      }

      if (gameInfo.reviews && gameInfo.reviews.steam) {
        const steamReview = gameInfo.reviews.steam

        embed.addField('Steam User Review', `${steamReview.text} (${steamReview.perc_positive}% from ${steamReview.total} users)`)
      }

      m.edit({ embed }).then(msg.delete())
    } catch (e) {
      return m
        .edit(`${ohNo} I tried looking for ${searchTerm} but an error occured.`)
        .then(msg.delete())
        .then(console.log(e))
    }
    // =========================
    // Helpers
    // =========================

    /**
  * Convert number to currency format
  * @param {number} num
  * @returns {string}
  */
    function toCurrency (num) {
      const price = Number.parseFloat(num).toFixed(2)

      return price > 0 ? `$${price}` : 'FREE'
    }
  }
}
module.exports = DealCommand
