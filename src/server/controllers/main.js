const axios = require('axios')
const fs = require('fs')
const featuredAudiobookIds = require('../data/featuredAudiobookIds.json')
const cachedFilePath = __dirname + '/../data/_cachedFeaturedAudiobooks.json'
let featuredAudiobooks = []

async function fetchAudiobooks() {
  if(fs.existsSync(cachedFilePath)) {
    // Cached file exists, use that.
    let cachedFile
    try {
      cachedFile = fs.readFileSync(cachedFilePath, 'utf8')
    } catch (err) {
      console.log(err)
    }
    featuredAudiobooks = JSON.parse(cachedFile)
    return
  } else {
    // Cached file does not exist.
    try {
      const fetchedAudiobooks = []
      const promises = featuredAudiobookIds.map(async featuredAudiobookId => {
        const response = await axios('https://archive.org/metadata/'+featuredAudiobookId)
        const cleanedUpDescription = response.data.metadata.description.replace(/<\/?("[^"]*"|'[^']*'|[^>])*(>|$)/g, "")
        
        const audiobook = {
          id: featuredAudiobookId,
          title: response.data.metadata.title,
          description: cleanedUpDescription.substr(0, 256),
          author: response.data.metadata.creator,
          coverImageSrc: "https://" + response.data.d1 + response.data.dir + "/" + response.data.files[response.data.files.findIndex(file => file.format === "JPEG")].name,
          audioTracks: fetchTracks(response.data)
        }
        fetchedAudiobooks.push(audiobook)
      })
      await Promise.all(promises)
      fs.writeFileSync(__dirname + '/../data/_cachedFeaturedAudiobooks.json', JSON.stringify(fetchedAudiobooks))
      featuredAudiobooks = fetchedAudiobooks
      return
    } catch (e) {
      console.error(e)
    }
  }
}
fetchAudiobooks()

function fetchTracks(audiobook) {
  let tracks = []
  audiobook.files.forEach(
    function(file) {
      if (file.track) {
        // Add it
        tracks.push("https://" + audiobook.d1 + audiobook.dir + "/" + file.name)
      }
    }
  )
  return tracks
}

exports.getFeaturedAudiobooks = async function () {
  return featuredAudiobooks
}
