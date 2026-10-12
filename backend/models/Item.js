const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    type: {
      type: String,
      required: true,
      enum: ['lost', 'found']
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    location: {
      type: String,
      required: true,
      trim: true
    },

    date: {
      type: String,
      required: true
    },

    contact: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String,
      default: ''
    },

    status: {
      type: String,
      enum: ['LOST', 'FOUND', 'CLAIMED', 'CLOSED'],
      required: true
    },

    approved: {
      type: Boolean,
      default: false
    },

    rejected: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
)

const Item = mongoose.model('Item', itemSchema)

module.exports = Item