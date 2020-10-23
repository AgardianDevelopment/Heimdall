const axios = require('axios')

const NEKOBOT_URL = 'https://nekobot.xyz/api/'
const NEKOLIFE_URL = 'https://nekos.life/api/v2/img'

const nekoBot = async (type) => {
  const res = await axios.get(`${NEKOBOT_URL}/image`, {
    params: {
      type: type
    }
  })

  const searchData = res.data
  return searchData
}

const nekoLife = async (type) => {
  const res = await axios.get(`${NEKOLIFE_URL}/${type}`)

  const searchData = res.data
  return searchData
}

module.exports = {
  nekoBot,
  nekoLife
}
