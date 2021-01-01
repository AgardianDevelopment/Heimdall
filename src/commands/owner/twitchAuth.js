const { Command } = require('discord-akairo')
const signale = require('signale')
const axios = require('axios')
const Auths = require('../../models/auths.js')

class TwitchAuth extends Command {
  constructor () {
    super('twitchauth', {
      aliases: ['twitchauth', 'tauth'],
      ownerOnly: true,
      quoted: false
    })
  }

  async exec (msg, { command }) {
    msg.delete()

    const config = {
      method: 'post',
      url: `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_ID}&client_secret=${process.env.TWITCH_SECRET}&grant_type=client_credentials`,
      headers: { }
    }

    const tokenFetch = await axios(config)
    const tokenData = tokenFetch.data.access_token

    const loading = await this.client.emojis.resolve(process.env.LOADING)
    const m = await msg.channel.send(`${loading} **Updating Twitch Auth**`)

    const findAuth = await Auths.findOne({ where: { service: 'twitchAPI' } })
    if (!findAuth) {
      signale.pending({ prefix: '[Twitch]', message: 'None Found: Attempting Twitch Auth update' })
      try {
        await Auths.create({ service: 'twitchAPI', token: tokenData })
        m.edit('Twitch Auth created...').then(m.delete({ timeout: 5000 }))
        return signale.success({ prefix: '[Twitch]', message: 'Twitch Auth Created...' })
      } catch (err) {
        m.edit('Unable to update Twitch Auth...').then(m.delete({ timeout: 5000 }))
        return signale.err({ prefix: '[Twitch]', message: err })
      }
    } else {
      try {
        signale.pending({ prefix: '[Twitch]', message: 'Existing: Attempting Twitch Auth update' })
        await Auths.update({ token: tokenData }, { where: { service: 'twitchAPI' } })
        m.edit('Twitch Auth updated...').then(m.delete({ timeout: 5000 }))
        return signale.success({ prefix: '[Twitch]', message: 'Twitch Auth Updated...' })
      } catch (err) {
        m.edit('Unable to update Twitch Auth...').then(m.delete({ timeout: 5000 }))
        return signale.err({ prefix: '[Twitch]', message: err })
      }
    }
  }
}

module.exports = TwitchAuth
