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

module.exports.fetchTracks = fetchTracks
