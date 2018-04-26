const router = require('express').Router()
const errorMessagesCompiler = require('../../helpers/errorMessagesCompiler')
const Gotcha = require('./Gotcha.model')
const {
  authentication,
  authorization
} = require('../../middlewares/auth')

router
  .get('/', async (req, res, next) => {
    let hallOfFame = []
    try {
      hallOfFame = await Gotcha.find().populate('user').exec()
    } catch(error) {
      next(error)
    }

    res.status(200).json({
      message: 'here are the people who made it',
      users: hallOfFame
    })
  })
  .use(authentication)
  .use(authorization)
  .post('/', async (req, res, next) => {
    let {
      id: user
    } = req.decoded

    let gotcha = {}
    try {
      gotcha = await Gotcha.create({
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

    res.status(201).json({
      message: 'gotcha!',
      gotcha
    })
  })

module.exports = router