const mongoose = require('mongoose')
const validator = require('validator')
const Schema = mongoose.Schema

const userSchema = Schema({
  email: {
    type: String,
    required: [true, 'email must be provided'],
    validate: {
      validator: function (value) {
        return validator.isEmail(value)
      },
      message: 'email is invalid'
    }
  },
  password: {
    type: String,
    required: [true, 'password must be provided'],
    validate: {
      validator: function (value) {
        return validator.isLength(value.trim(), 6)
      },
      message: 'password should be more than 6 characters'
    }
  },
  nickname: {
    type: String,
    required: [true, 'nickname must be provided'],
    validate: {
      validator: function (value) {
        return validator.isLength(value.trim(), 4)
      },
      message: 'name should be more longer than 4 characters'
    }
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('User', userSchema)