const router = require('express').Router()
const User = require('./User.model')
const errorMessagesCompiler = require('../../helpers/errorMessagesCompiler')

router
  .get('/', async (req, res, next) => {
    let users = []
    try {
      users = await User.find().exec()
      res.status(200).json({
        message: 'query users success',
        users
      })
    } catch (error) {
      next(error)
    }
  })
  .post('/', async (req, res, next) => {
    const {
      email,
      password
    } = req.body

    let user = {}
    try {
      user = await User.create({
        email,
        password
      })
      res.status(201).json({
        message: 'create user success',
        user
      })
    } catch (error) {
      if (error.name === 'ValidationError') {
        res.status(400).json({
          error: errorMessagesCompiler(error.errors)
        })
      } else {
        next(error)
      }
    }
  })

  module.exports = router