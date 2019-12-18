const express = require('express')
var hbs = require('express-handlebars')
// const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()

// parse incoming requests
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))

// serve static files from /public
app.use(express.static('public'))

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
  helpers: require('./handlebars-helpers')
}));
app.set('view engine', 'hbs')
app.set('views', __dirname + "/views")

// include routes
var routes = require('./routes/index')
app.use('/', routes)

// listen on port 3000
app.listen(port, function () {
  console.log('Express app listening on port 3000')
})
