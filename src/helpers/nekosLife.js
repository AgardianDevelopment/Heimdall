const axios = require('axios')

const BASE_URL = 'https://nekos.life/api/v2/img'

const search = async (type) => {
  const res = await axios.get(`${BASE_URL}/${type}`)

  const searchData = res.data
  return searchData
}

module.exports = { search }
