const { Command } = require('discord-akairo')
const signale = require('signale')
const Auths = require('../../models/hiddenPerms.js')

class UserAuth extends Command {
  constructor () {
    super('userauth', {
      aliases: ['userauth', 'uauth', 'userperm', 'uperm'],
      ownerOnly: true,
      quoted: false,
      args: [
        {
          id: 'user',
          type: 'user',
          prompt: {
            start: 'Who will be given permissions?',
            retry: 'Please enter a correct username...'
          }
        },
        {
          id: 'commandName',
          type: ['datbutt', 'kimchi', 'tentai', 'angel'],
          prompt: {
            start: 'Which command will permissions be undated on',
            retry: 'Please retry hidden command name...'
          }

        },
        {
          id: 'commandPerm',
          type: ['false', 'true'],
          prompt: {
            start: 'Should they be allowed to user this command true/false',
            retry: 'Please enter true or false...'
          }
        }
      ]
    })
  }

  async exec (msg, { user, commandName, commandPerm }) {
    msg.delete()

    const loading = await this.client.emojis.resolve(process.env.LOADING)
    const ohNo = await this.client.emojis.resolve(process.env.CROSS)
    const m = await msg.channel.send(`${loading} **Updating User Auth**`)

    if (commandName === 'datbutt') {
      const findAuth = await Auths.findOne({ where: { userID: user.id } })
      if (!findAuth) {
        signale.pending({ prefix: '[User Auth]', message: 'Updating User Auth' })
        try {
          await Auths.create({ userID: user.id, userName: user.username, datbutt: commandPerm })
          m.edit('User Auth created...').then(m.delete({ timeout: 5000 }))
          return signale.success({ prefix: '[User Auth]', message: 'User Auth Created...' })
        } catch (err) {
          m.edit('Unable to update User Auth...').then(m.delete({ timeout: 5000 }))
          return signale.error({ prefix: '[User Auth]', message: err })
        }
      } else {
        try {
          signale.pending({ prefix: '[User Auth]', message: 'Existing: Attempting User Auth update' })
          await Auths.update({ datbutt: commandPerm }, { where: { userID: user.id } })
          m.edit('User Auth updated...').then(m.delete({ timeout: 5000 }))
          return signale.success({ prefix: '[User Auth]', message: 'User Auth Updated...' })
        } catch (err) {
          m.edit('Unable to update User Auth...').then(m.delete({ timeout: 5000 }))
          return signale.error({ prefix: '[User Auth]', message: err })
        }
      }
    } else if (commandName === 'kimchi') {
      const findAuth = await Auths.findOne({ where: { userID: user.id } })
      if (!findAuth) {
        signale.pending({ prefix: '[User Auth]', message: 'Updating User Auth' })
        try {
          await Auths.create({ userID: user.id, userName: user.username, kimchi: commandPerm })
          m.edit('User Auth created...').then(m.delete({ timeout: 5000 }))
          return signale.success({ prefix: '[User Auth]', message: 'User Auth Created...' })
        } catch (err) {
          m.edit('Unable to update User Auth...').then(m.delete({ timeout: 5000 }))
          return signale.error({ prefix: '[User Auth]', message: err })
        }
      } else {
        try {
          signale.pending({ prefix: '[User Auth]', message: 'Existing: Attempting User Auth update' })
          await Auths.update({ kimchi: commandPerm }, { where: { userID: user.id } })
          m.edit('User Auth updated...').then(m.delete({ timeout: 5000 }))
          return signale.success({ prefix: '[User Auth]', message: 'User Auth Updated...' })
        } catch (err) {
          m.edit('Unable to update User Auth...').then(m.delete({ timeout: 5000 }))
          return signale.error({ prefix: '[User Auth]', message: err })
        }
      }
    } else if (commandName === 'tentai') {
      const findAuth = await Auths.findOne({ where: { userID: user.id } })
      if (!findAuth) {
        signale.pending({ prefix: '[User Auth]', message: 'Updating User Auth' })
        try {
          await Auths.create({ userID: user.id, userName: user.username, tentai: commandPerm })
          m.edit('User Auth created...').then(m.delete({ timeout: 5000 }))
          return signale.success({ prefix: '[User Auth]', message: 'User Auth Created...' })
        } catch (err) {
          m.edit('Unable to update User Auth...').then(m.delete({ timeout: 5000 }))
          return signale.err({ prefix: '[User Auth]', message: err })
        }
      } else {
        try {
          signale.pending({ prefix: '[User Auth]', message: 'Existing: Attempting User Auth update' })
          await Auths.update({ tentai: commandPerm }, { where: { userID: user.id } })
          m.edit('User Auth updated...').then(m.delete({ timeout: 5000 }))
          return signale.success({ prefix: '[User Auth]', message: 'User Auth Updated...' })
        } catch (err) {
          m.edit('Unable to update User Auth...').then(m.delete({ timeout: 5000 }))
          return signale.error({ prefix: '[User Auth]', message: err })
        }
      }
    } else if (commandName === 'angel') {
      const findAuth = await Auths.findOne({ where: { userID: user.id } })
      if (!findAuth) {
        signale.pending({ prefix: '[User Auth]', message: 'Updating User Auth' })
        try {
          await Auths.create({ userID: user.id, userName: user.username, angel: commandPerm })
          m.edit('User Auth created...').then(m.delete({ timeout: 5000 }))
          return signale.success({ prefix: '[User Auth]', message: 'User Auth Created...' })
        } catch (err) {
          m.edit('Unable to update User Auth...').then(m.delete({ timeout: 5000 }))
          return signale.err({ prefix: '[User Auth]', message: err })
        }
      } else {
        try {
          signale.pending({ prefix: '[User Auth]', message: 'Existing: Attempting User Auth update' })
          await Auths.update({ angel: commandPerm }, { where: { userID: user.id } })
          m.edit('User Auth updated...').then(m.delete({ timeout: 5000 }))
          return signale.success({ prefix: '[User Auth]', message: 'User Auth Updated...' })
        } catch (err) {
          m.edit('Unable to update User Auth...').then(m.delete({ timeout: 5000 }))
          return signale.error({ prefix: '[User Auth]', message: err })
        }
      }
    } else {
      m.edit(`${ohNo} Something went wrong, try again.`)
    }
  }
}

module.exports = UserAuth
