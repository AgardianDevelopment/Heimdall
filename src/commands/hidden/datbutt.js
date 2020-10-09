const { Command } = require('discord-akairo')
const fetch = require('node-fetch')
const Perms = require('../../models/perms.js')

class DatbuttCommand extends Command {
  constructor () {
    super('datbutt', {
      aliases: ['datbutt', 'dabutt'],
      category: 'hidden',
      cooldown: 5000,
      ratelimit: 1,
      description: { content: 'The forbidden command.' }
    })
  }

  async exec (msg) {
    const permission = await Perms.findAll({ where: { userID: msg.author.id } })

    const response = ['Just who the fuck do you think you are?', 'That\'s disgusting', 'haha and then what :wink:', 'I bet you say that to all the girls.', 'We are never ever getting back together!!!', 'Seriously, we barely know each other.', ':middle_finger: Sit on it and spin bitch!', 'Umm... I have a boyfriend.']

    if (permission.length === 0) return msg.channel.send(response[Math.floor(Math.random() * response.length)]).then(msg.delete())
    if (permission[0].dataValues.datbutt === 'false') return msg.channel.send(response[Math.floor(Math.random() * response.length)]).then(msg.delete())

    const loading = await this.client.emojis.resolve('620109183399755796')
    const ohNo = await this.client.emojis.resolve('620106037390999558')
    const m = await msg.channel.send(`${loading} **Hold onto your butts!**`)

    var fetchRequestOptions = {
      method: 'GET',
      headers: {
        authorization: `Client-ID ${process.env.IMGUR}`
      },
      redirect: 'follow'
    }

    try {
      var res = await fetch('https://api.imgur.com/3/album/JZUQ7/images', fetchRequestOptions).then(res => res.json())
    } catch (e) {
      console.log(e)
      return m.edit(`${ohNo} Looks like something went wrong.`).then(msg.delete())
    }
    if (res.status == 403) {
      return m.edit(`${ohNo} Looks like something went wrong.`).then(msg.delete())
    }

    var i = Math.floor(Math.random() * res.data.length)

    if (res.data[i].is_album === true) {
      var resPhoto = res.data[i].images[0].link
    } else {
      var resPhoto = res.data[i].link
    }

    const embed = this.client.util.embed()
      .setTitle('Image didn\'t load click here.')
      .setURL(resPhoto)
      .setColor(process.env.EMBED)
      .setImage(resPhoto)
      .setFooter('Requested by REDACTED | via REDACTED • REDATED at XX:XX GMT', 'https://just.vulgarity.xyz/CWtyugHIu6oVFuYN.png')

    m.edit({ embed }).then(msg.delete())
  }
}
module.exports = DatbuttCommand
