const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gotchaSchema = Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    isAsync: true,
    validate: {
      validator: function (value, cb) {
        mongoose.model('Gotcha').findOne({
          user: value
        })
          .then(user => {
            if (user) cb(false, 'Relax, you already made it')
            else cb(true)
          })
      }
    }
  }
}, {
  timestamps: true
})


module.exports = mongoose.model('Gotcha', gotchaSchema)