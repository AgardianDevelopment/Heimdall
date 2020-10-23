const Booru = require('booru')

const e621 = async (searchTerm) => {
  const res = await Booru.search('e621.net', searchTerm, { limit: 1, random: true })

  const searchData = await res.posts[0]
  return searchData
}

const gelbooru = async (searchTerm) => {
  const res = await Booru.search('gelbooru', searchTerm, { limit: 1, random: true })

  const searchData = await res.posts[0]
  return searchData
}

const r34 = async (searchTerm) => {
  const res = await Booru.search('rule34', searchTerm, { limit: 1, random: true })

  const searchData = await res.posts[0]
  return searchData
}

module.exports = {
  e621,
  gelbooru,
  r34
}
