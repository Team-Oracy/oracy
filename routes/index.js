var express = require('express')
var router = express.Router()
var mid = require('../middleware')
const axios = require('axios');
const featuredAudiobookIds = require('../data/featuredAudiobookIds.json')

// GET /
router.get('/', mid.redirectToHTTPS, function(req, res, next) {
  next()
})

// POST /@*
router.get('/featured', mid.redirectToHTTPS, function(req, res, next) {
  let featuredAudiobooks = []
  featuredAudiobookIds.forEach(function(value) {
    axios.get('https://archive.org/metadata/'+value)
      .then(function (response) {
        // handle success
        console.log(response.data)
        featuredAudiobooks.push(response.data)
        if (featuredAudiobookIds.length == featuredAudiobooks.length) {
          res.send(featuredAudiobooks)
          next()
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error)
      })
      .finally(function () {
        // always executed
      })
  })
})

module.exports = router
