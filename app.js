require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')

const {
  ATLASUSER,
  ATLASPASS,
  ATLASDBNAME,
  PORT
} = process.env
const dbUrl = `mongodb+srv://${ATLASUSER}:${ATLASPASS}@free-easy-cluster-fiahg.mongodb.net/${ATLASDBNAME}`

const app = express()

// important middlewares
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(logger('dev'))

mongoose.connect(dbUrl, (err) => {
  if (!err) console.log('database connected')
  else console.error(err)
})

// app to route binding
require('./resources')(app)

// server check
app.use('/test', (req, res, next) => {
  res.status(200).send(`server is running on ${(PORT ? PORT : 3000)}`)
})

// clean up database
// DANGER! stupid hack!
app.use('/clean-database', async (req, res, next) => {
   try {
     await mongoose.model('User').deleteMany({}).exec()
   } catch (error) {
     return next(error)
   }
   res.status(200).send('database clean up finished!')
})

// generic error handling
app.use((error, req, res, next) => {
  console.error(error)
  res.status(500).send({
    error
  })
})

module.exports = app

