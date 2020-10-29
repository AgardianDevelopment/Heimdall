const axios = require('axios')

const ANIME_URL = 'https://kitsu.io/api/edge/anime'
const MANGA_URL = 'https://kitsu.io/api/edge/manga'

const anime = async (type) => {
  const res = await axios.get(`${ANIME_URL}?filter[text]=${type}&page[limit]=1?json=true`)

  const searchData = res.data.data[0]
  return searchData
}

const manga = async (type) => {
  const res = await axios.get(`${MANGA_URL}?filter[text]=${type}&page[limit]=1`)

  const searchData = res.data.data[0]
  return searchData
}

module.exports = {
  anime,
  manga
}
