const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
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
    select: false,
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
  },
  uploaded: {
    type: Boolean,
    default: false
  },
  imgUrl: {
    type: String,
    default: 'http://via.placeholder.com/400?text=belum upload'
  }
}, {
  timestamps: true
})

userSchema.pre('save', function (next) {
  const salt = bcrypt.genSaltSync()
  const hash = bcrypt.hashSync(this.password, salt)
  
  this.password = hash

  next()
})

module.exports = mongoose.model('User', userSchema)