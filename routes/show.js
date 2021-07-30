const router = require('express').Router()
const File = require('../models/file')

router.get('/:uuid', async (req, res) => {  // : use for dynamic parameter
  try {
    const file /* file db object  */ = await File.findOne({ uuid: req.params.uuid }) // req.params contain all details of req
    if (!file) {
      return res.render('download', { error: "Link is expire or File is not uploaded" })
    }

    return res.render('download', {
      uuid: file.uuid,
      fileName: file.fileName,
      fileSize: file.size,
      downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
    })
  } catch (err) {
    return res.render('download', { error: 'Something Went wrong' }) // dowload.ejs
  }
})


module.exports = router