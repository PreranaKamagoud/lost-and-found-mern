const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

const User = require('./models/User')

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI)

    const email = 'admin@lostfound.com'
    const password = 'admin123'
    const name = 'Admin'

    const existingAdmin = await User.findOne({ email })

    if (existingAdmin) {
      existingAdmin.role = 'admin'
      await existingAdmin.save()
      console.log('Existing user updated to admin')
    } else {
      const hashedPassword = await bcrypt.hash(password, 10)

      const admin = new User({
        name,
        email,
        password: hashedPassword,
        role: 'admin'
      })

      await admin.save()

      console.log('Admin account created successfully')
    }

    console.log('Email:', email)
    console.log('Password:', password)

    await mongoose.disconnect()
  } catch (error) {
    console.log('Failed to create admin')
    console.log(error.message)
  }
}

createAdmin()