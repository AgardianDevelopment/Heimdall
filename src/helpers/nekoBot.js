const axios = require('axios')

const BASE_URL = 'https://nekobot.xyz/api/'

const search = async (type) => {
  const res = await axios.get(`${BASE_URL}/image`, {
    params: {
      type: type
    }
  })

  const searchData = res.data
  return searchData
}

module.exports = { search }
