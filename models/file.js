// this file is used to store file in DataBase
const mongoose = require('mongoose')
const Schema = mongoose.Schema


const fileSchema = new Schema({ // field sturcture for db
  fileName: { type: String, require: true },
  path: { type: String, require: true },
  size: { type: Number, require: true },
  uuid: { type: String, require: true },
  sender: { type: String, require: false },
  receiver: { type: String, require: false }
}, { timestamps: true })

module.exports = mongoose.model('File', fileSchema) // mongoose model is creating and exporting it