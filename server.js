require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const MOVIEDEX = require('./MOVIEDEX.json')

const app = express();

app.use(morgan('dev'))

// API TOKEN VALIDATION MIDDLEWARE
app.use(validateBearerToken = (req, res, next) => {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res
      .status(401)
      .json({ error: 'Unauthorized request' })
  }

  //move to the next middleware
  next()
})

// REQUEST HANDLER
handleGetMovies = (req, res) => {
  const { genre, country, average } = req.query
  let results = MOVIEDEX

  if (genre) {
    results = results
      .filter(movie =>
        movie
          .genre
          .toLowerCase()
          .includes(genre.toLowerCase())
      )
  }

  if (country) {
    results = results
      .filter(movie =>
        movie
          .country
          .toLowerCase()
          .includes(country.toLowerCase())
      )
  }

  if (average) {
    results = results
      .filter(movie =>
        movie.avg_vote > Number(average)
      )
  }

  if (results.length < 1) {
    res
      .status(400)
      .json({ error: 'There are no movies meeting these parameters; please try again' })
  }

  res.json(results)
}

// ROUTES
app.get('/movies', handleGetMovies)

// SERVER LISTENING
const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`)
})