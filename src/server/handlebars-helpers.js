// const crypto = require('crypto')
// const fs = require('fs')

module.exports = {
//   hash: function(url) {
//     const contents = fs.readFileSync(url).toString()
//     return crypto.createHash('md5').update(contents).digest("hex")
//   },
  offset: function(index) {
    index += 1
    return index
  }
}
