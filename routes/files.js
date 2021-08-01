const router = require('express').Router()
const multer = require('multer')
const path = require('path')
const File = require('../models/file.js')
const { v4: uuidv4 } = require('uuid')

let storage = multer.diskStorage({
  destination: (req, res, callback) => callback(null, 'uploads/'),
  filename: (req, file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}` // 345235342-234513245
    callback(null, uniqueName)
  },
})

let upload = multer({ storage, limits: { fileSize: 1000000 * 100 }, }).single('myfile') //100mb

router.post('/', (req, res) => {
  console.log('IN / CEHCKING')
  // store file
  upload(req, res, async (err) => { // upload's multer
    // validation request
    if (!req.file) {
      return res.json({ error: 'File is required' })
    }

    if (err) {
      // return res.status(500).send({ error: err.message })
      return res.status(500), send({ error: err.message })
    }
    // store into database
    const file = new File({
      filename: req.file.filename,
      uuid: uuidv4(),
      path: req.file.path,
      size: req.file.size
    })
    const response = await file.save()
    // response -> link
    return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` })
  })
})

router.post('/send', async (req, res) => { // mail api
  const { uuid, emailTo, emailFrom, expiresIn } = req.body
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(422).send({ error: 'All fields are required except expiry.' })
  }
  // Get data from db 
  try {
    const file = await File.findOne({ uuid: uuid })
    if (file.sender) {
      return res.status(422).send({ error: 'Email already sent once.' })
    }
    file.sender = emailFrom
    file.receiver = emailTo
    const response = await file.save()
    // send mail
    const sendMail = require('../services/mailService')
    sendMail({
      from: emailFrom,
      to: emailTo,
      subject: `A File is shared by ${emailFrom}`,
      text: `${emailFrom} shared a file with you.`,
      html: require('../services/emailTemplate')({ // https://github.com/leemunroe/responsive-html-email-template
        emailFrom: emailFrom,
        downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}?source=email`,
        size: parseInt(file.size / 1000) + ' KB',
        expires: '24 hours'
      })
    }).then(() => {
      return res.json({ success: true })
    }).catch(err => {
      return res.status(500).json({ error: 'Error in email sending.: '+ err })
    })
  } catch (err) {
    return res.status(500).send({ error: 'Something went wrong.' })
  }

})

module.exports = router