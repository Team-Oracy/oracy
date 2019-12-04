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
        // Strips away all HTML tags embedded in description
        let cleanedUpDescription = response.data.metadata.description.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "")
        let audiobook = {
          title: response.data.metadata.title,
          description: cleanedUpDescription,
          creator: response.data.metadata.creator,
          coverImageSrc: "https://" + response.data.d1 + response.data.dir + "/" + response.data.files[response.data.files.findIndex(file => file.format === "JPEG")].name
        }
        console.log(audiobook)
        featuredAudiobooks.push(audiobook)
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
