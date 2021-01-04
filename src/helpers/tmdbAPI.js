const axios = require('axios')

// const movieURL = 'https://api.themoviedb.org/3/search/movie?api_key=' + process.env.TMDB + '&query=' + search + '&page=1&include_adult=false'
// const seriesURL = 'https://api.themoviedb.org/3/search/tv?api_key=' + process.env.TMDB + '&query=' + search + '&page=1'
// const actorURL = 'https://api.themoviedb.org/3/search/person?api_key=' + process.env.TMDB + '&query=' + search + '&page=1&include_adult=false'

const movie = async (search) => {
  const movieSearch = await axios.get('https://api.themoviedb.org/3/search/movie?api_key=' + process.env.TMDB + '&query=' + search + '&page=1&include_adult=false')

  const movieData = movieSearch.data.results[0]
  return movieData
}

const series = async (search) => {
  const seriesSearch = await axios.get('https://api.themoviedb.org/3/search/tv?api_key=' + process.env.TMDB + '&query=' + search + '&page=1')

  const seriesData = seriesSearch.data.results[0]
  return seriesData
}

const actor = async (search) => {
  const actorSearch = await axios.get('https://api.themoviedb.org/3/search/person?api_key=' + process.env.TMDB + '&query=' + search + '&page=1&include_adult=false')

  const actorData = actorSearch.data.results[0]
  return actorData
}

module.exports = {
  movie,
  series,
  actor
}
