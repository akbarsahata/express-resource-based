const http = require('http')
const path = require('path')
const app = require('../app')

const PORT = process.env.PORT || 3000

const server = http.createServer(app)

server.listen(Number(PORT), () => {
  console.log(`Running on ${PORT}`)
})
