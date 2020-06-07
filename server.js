require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIEDEX = require('./MOVIEDEX.json')

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

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

app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' } }
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

// SERVER LISTENING
const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`)
})