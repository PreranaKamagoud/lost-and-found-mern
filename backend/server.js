const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const itemRoutes = require('./routes/itemRoutes')
const adminRoutes = require('./routes/adminRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/items', itemRoutes)
app.use('/api/admin', adminRoutes)

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully')
  })
  .catch((error) => {
    console.log('MongoDB connection failed')
    console.log(error.message)
  })

app.get('/', (req, res) => {
  res.json({
    message: 'Lost & Found Backend is running'
  })
})

const PORT = 5000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})