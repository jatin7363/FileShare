const mongoose = require('mongoose')
require('dotenv').config()

function connectDB() {
  // DB connenction
  mongoose.connect(process.env.MONGO_CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true }) // userCreateIndex: true,
  const connection = mongoose.connection // connection store in variable

  connection.once('open', () => { // triggering build-in event for connection
    console.log('DB Connected')
  }).catch(err => {
    console.error('Connection failed, \nError : ' + err)
  })

}

module.exports = connectDB