const router = require('express').Router()
const User = require('./users/User.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {
  SECRETKEY
} = process.env

router
  .get('/', (req, res, next) => {
    res.status(200).send('here is /sign-in')
  })
  .post('/', async (req, res, next) => {
    let {
      email,
      password
    } = req.body
    
    let user = {}

    try {
      user = await User.findOne({
        email
      }).select('+password').exec()
    } catch (error) {
      return next(error)
    }

    if (!user) return res.status(400).json({
      message: 'user not found'
    })

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({
        message: 'email and password mismatch'
      })
    }

    const payload = {
      id: user._id,
      nickname: user.nickname,
      email: user.email,
      uploaded: user.uploaded
    }
    const token = jwt.sign(payload, SECRETKEY)

    res.status(200).json({
      nickname: user.nickname,
      email: user.email,
      imgUrl: user.imgUrl,
      token
    })
  })

module.exports = router