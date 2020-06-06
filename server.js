const express = require('express')
const morgan = require('morgan')
const MOVIEDEX = require('./MOVIEDEX.json')

const app = express();

app.use(morgan('dev'))

// REQUEST HANDLER
handleGetMovies = () => {
  console.log('movies requested...')
}

// ROUTES
app.get('/movies', handleGetMovies)

// SERVER LISTENING
const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server is listening on PORT ${PORT}`)
})