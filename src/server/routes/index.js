var express = require('express')
var router = express.Router()
var mid = require('../middleware')
const Main = require('../controllers/main')

// GET /
router.get('/', async(req, res, next) => {
  try {
    const featuredAudiobooks = await Main.getFeaturedAudiobooks()
    res.render('main', { featuredAudiobooks: featuredAudiobooks })
  } catch (error) {
    console.log(error)
  }
})

// POST /@*
router.get('/featured', async(req, res, next) => {
  try {
    const featuredAudiobooks = await Main.getFeaturedAudiobooks()
    res.send(featuredAudiobooks)
    next()
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
