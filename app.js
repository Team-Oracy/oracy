const express = require('express')
// const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

// parse incoming requests
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))

// set the port of our application
// process.env.PORT lets the port be set by Heroku
// from https://scotch.io/tutorials/how-to-deploy-a-node-js-app-to-heroku
const port = process.env.PORT || 3000

// include routes
var routes = require('./routes/index')
app.use('/', routes)

// use CORS
cors({credentials: true, origin: true})
app.use(cors())

// listen on port 3000
app.listen(port, function () {
  console.log('Express app listening on port 3000')
})
