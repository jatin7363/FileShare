const express = require('express')
const app = express() // calling express
const path = require('path')
const PORT = process.env.PORT || 3000

app.use(express.static('public'))
app.use(express.json())

const connectDB = require('./config/db')
connectDB()

// Template engine // route configration
app.set('views', path.join(__dirname, '/views')) // html file konse path pe h 
app.set('view engine', 'ejs') // html file ki extention kya h 

// Routes
app.use('/api/files', require('./routes/files')) // if /api/files is use then send it to './routes/files'
app.use('/files', require('./routes/show'))
app.use('/files/download',require('./routes/download'))

app.listen(PORT, () => {
  console.log(`Listening on port no. ${PORT}`)
})
