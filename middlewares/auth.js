const jwt = require('jsonwebtoken')
const User = require('../resources/users/User.model')

const {
  SECRETKEY
} = process.env

module.exports = {
  authentication: (req, res, next) => {
    if (!req.headers.authentication) return res.status(403).json({
      message: 'authentication header not found!'
    })

    let decoded = {}
    try {
      decoded = jwt.verify(req.headers.authentication, SECRETKEY)
    } catch (error) {
      return next(error)
    }

    req.decoded = decoded
    next()
  },
  authorization: async (req, res, next) => {
    if (req.decoded && req.decoded.uploaded) {
      next()
    } else {
      let user = {}
      try {
        user = await User.findById(req.decoded.id)
      } catch (error) {
        next(error)
      }

      if (user && user.uploaded) {
        next()
      } else {
        res.status(403).json({
          message: 'picture not uploaded yet'
        })
      }
    }
  }
}