const fs = require('fs')

function bindAppToRouter (app) {
  let fileOrDir = ''
  fs.readdirSync(__dirname).forEach(dir => {
    fileOrDir = dir.replace(/(\w).(js)/, '$1')
    if (dir !== 'index.js') {
      app.use(`/${fileOrDir}`, require(`./${dir}`))
    }
  })
}

module.exports = bindAppToRouter