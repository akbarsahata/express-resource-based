const fs = require('fs')

function bindAppToRouter (app) {
  fs.readdirSync(__dirname).forEach(dir => {
    if (dir !== 'index.js') {
      app.use(`/${dir}`, require(`./${dir}`))
    }
  })
}

module.exports = bindAppToRouter