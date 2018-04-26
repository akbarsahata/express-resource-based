const router = require('express').Router()
const User = require('./User.model')
const multer = require('multer')
const Storage = require('@google-cloud/storage')
const errorMessagesCompiler = require('../../helpers/errorMessagesCompiler')
const {
  authentication
} = require('../../middlewares/auth')

const uploaderMem = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024
  }
})

const BUCKET_CONFIG = {
  name: 'blog.quantum-fox.gq'
}

function getPublicUrl (filename) {
  return `https://storage.googleapis.com/${BUCKET_CONFIG.name}/${filename}`;
}

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
      password,
      nickname
    } = req.body

    let user = {}
    try {
      user = await User.create({
        email,
        password,
        nickname
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
  .post('/upload', authentication, uploaderMem.single('picture'), (req, res, next) => {
    if (!req.file) return next('upload gagal')
    if (req.file.mimetype.split('/')[0] !== 'image') {
      return res.status(400).json({
        message: 'upload image only!'
      })
    }
    const storage = Storage({
      projectId: 'kuyungkoding',
      keyFilename: 'gcs-uploader.json'
    })
    const bucket = storage.bucket(BUCKET_CONFIG.name)
    const filename = req.decoded.nickname 
                     + '-' + Date.now() 
                     + '.' + req.file.originalname.split('.').pop() // gets the extension
    const file = bucket.file(filename)
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype
      }
    })
  
    stream.on('error', (err) => {
      console.log('error uploading to GCS')
      console.log(err)
      next(err)
    })
  
    stream.on('finish', () => {
      file.makePublic()
        .then(() => {
          req.imgUrl = getPublicUrl(filename)
          next()
        })
    })
  
    stream.end(req.file.buffer)
  }, async (req, res, next) => {
    try {
      await User.findByIdAndUpdate(req.decoded.id, {
        $set: {
          imgUrl:  req.imgUrl,
          uploaded: true
        }
      }).exec()
    } catch (error) {
      return next(error)
    }

    res.status(200).json({
      message: 'upload image success',
      imgUrl: req.imgUrl
    })
  })

  module.exports = router