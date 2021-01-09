const axios = require('axios')

// dogURL: 'https://random.dog/doggos'
// foxURL: 'https://randomfox.ca/floof/'
// catURL: 'https://api.thecatapi.com/v1/images/search'
// birbURL: 'http://shibe.online/api/birds?&urls=true&httpsUrls=true'

const cute = async (type) => {
  if (type === 'dog') {
    const dogSearch = await axios.get('https://random.dog/doggos')
    const dogData = dogSearch.data
    const dogRanData = 'https://random.dog/' + dogData[Math.floor(Math.random() * dogData.length)]
    return dogRanData
  } else if (type === 'fox') {
    const foxSearch = await axios.get('https://randomfox.ca/floof/')
    const foxData = foxSearch.data.image
    return foxData
  } else if (type === 'cat') {
    const catSearch = await axios.get('https://api.thecatapi.com/v1/images/search')
    const catData = catSearch.data[0].url
    return catData
  } else if (type === 'bird') {
    const birdSearch = await axios.get('http://shibe.online/api/birds?&urls=true&httpsUrls=true')
    const birdData = birdSearch.data[0]
    return birdData
  } else {
    return false
  }
}

// Insult url: 'https://evilinsult.com/generate_insult.php?lang=en&type=json'
const insult = async () => {
  const insultSearch = await axios.get('https://evilinsult.com/generate_insult.php?lang=en&type=json')
  const insultData = insultSearch.data.insult
  return insultData
}

const trivia = async (type) => {
  if (type === 'games') {
    const gameSearch = await axios.get('https://opentdb.com/api.php?amount=1&category=15&type=multiple')
    const gameData = gameSearch.data.results[0]
    return gameData
  } else if (type === 'animals') {
    const animalSearch = await axios.get('https://opentdb.com/api.php?amount=1&category=27&type=multiple')
    const animalData = animalSearch.data.results[0]
    return animalData
  } else if (type === 'movies') {
    const movieSearch = await axios.get('https://opentdb.com/api.php?amount=1&category=11&type=multiple')
    const movieData = movieSearch.data.results[0]
    return movieData
  } else if (type === 'anime') {
    const animeSeach = await axios.get('https://opentdb.com/api.php?amount=1&category=31&type=multiple')
    const animeData = animeSeach.data.results[0]
    return animeData
  } else if (type === 'animation') {
    const animationSearch = await axios.get('https://opentdb.com/api.php?amount=1&category=32&type=multiple')
    const animationData = animationSearch.data.results[0]
    return animationData
  } else if (type === 'music') {
    const musicSearh = await axios.get('https://opentdb.com/api.php?amount=1&category=12&type=multiple')
    const musicData = musicSearh.data.results[0]
    return musicData
  } else if (type === 'general') {
    const generalSearch = await axios.get('https://opentdb.com/api.php?amount=1&category=9&type=multiple')
    const generalData = generalSearch.data.results[0]
    return generalData
  } else {
    return false
  }
}

module.exports = {
  cute,
  insult,
  trivia
}
