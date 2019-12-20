const express = require('express')
var hbs = require('express-handlebars')
// const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const helmet = require('helmet')
const nocache = require('nocache')
app.use(nocache())

app.use(helmet())

// parse incoming requests
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))

// serve static files from /public
app.use(express.static('public'))

if (app.get('env') === 'development') {
  const livereload = require('livereload')
  const server = livereload.createServer()
  server.watch(__dirname + "/public")
}

// set the port of our application
// process.env.PORT lets the port be set by Heroku
// from https://scotch.io/tutorials/how-to-deploy-a-node-js-app-to-heroku
const port = process.env.PORT || 3000

// use CORS
cors({credentials: true, origin: true})
app.use(cors())

// Set view engine to Handlebars
app.engine('hbs', hbs({
  defaultLayout: 'app', 
  extname: '.hbs',
  helpers: require('./src/handlebars-helpers')
}));
app.set('view engine', 'hbs')
app.set('views', "./src/views")

// include routes
var routes = require('./src/routes/index')
app.use('/', routes)

// listen on port 3000
app.listen(port, function () {
  console.log('Express app listening on port 3000')
})
