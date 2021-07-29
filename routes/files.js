const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const File = require('../models/file.js')
const { v4: uuid4 } = require('uuid')

let storage = multer.diskStorage({
  destination: (req, res, callback) => callback(null, 'uploads/'),
  filename: (req, file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}` // 345235342-234513245
    callback(null, uniqueName)
  },
})

// let upload = multer({
//   storage: storage,
//   limit: { fileSize: 1000000 * 100 }, // approx 100mb
// }).single('myfile')
let upload = multer({ storage, limits:{ fileSize: 1000000 * 100 }, }).single('myfile'); //100mb


router.post('/', (req, res) => {
  // store file
  upload(req, res, async (err) => { // multer
    // validation request
    if (!req.file) {
      return res.json({ error: 'File is required'})
    }

    if (err) {
      return res.status(500), send({ error: err.message })
    }
    // store into database
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size
    })
    const response = await file.save()
    // response -> link
    return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` })
  })


})

module.exports = router