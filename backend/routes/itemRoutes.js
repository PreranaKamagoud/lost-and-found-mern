
const express = require('express')
const Item = require('../models/Item')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      category,
      location,
      date,
      contact,
      image
    } = req.body

    if (
      !type ||
      !title ||
      !description ||
      !category ||
      !location ||
      !date ||
      !contact
    ) {
      return res.status(400).json({
        message: 'Please fill all required fields'
      })
    }

    const status = type === 'lost' ? 'LOST' : 'FOUND'

    const item = new Item({
      userId: req.user.id,
      type,
      title,
      description,
      category,
      location,
      date,
      contact,
      image: image || '',
      status
    })

    await item.save()

    let matches = []

    if (type === 'found') {
      const lostItems = await Item.find({
        type: 'lost',
        status: 'LOST'
      }).sort({
        createdAt: -1
      })

      const foundText = `${title} ${description}`.toLowerCase()
      const foundWords = foundText
        .split(/\s+/)
        .filter(word => word.length >= 3)

      matches = lostItems
        .map(lostItem => {
          let score = 0

          if (
            lostItem.category.toLowerCase() ===
            category.toLowerCase()
          ) {
            score += 40
          }

          if (
            lostItem.location.toLowerCase() ===
            location.toLowerCase()
          ) {
            score += 30
          }

          const lostText =
            `${lostItem.title} ${lostItem.description}`.toLowerCase()

          const commonWords = foundWords.filter(word =>
            lostText.includes(word)
          )

          score += Math.min(commonWords.length * 5, 20)

          if (lostItem.date === date) {
            score += 10
          }

          return {
            item: lostItem,
            score
          }
        })
        .filter(match => match.score >= 30)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
    }

    res.status(201).json({
      message: 'Item reported successfully',
      item,
      matches
    })
  } catch (error) {
    console.log('CREATE ITEM ERROR:')
    console.log(error)

    res.status(500).json({
      message: 'Failed to report item',
      error: error.message
    })
  }
})

router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body

    const allowedStatuses = [
      'LOST',
      'FOUND',
      'CLAIMED',
      'CLOSED'
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: 'Invalid status'
      })
    }

    const item = await Item.findById(req.params.id)

    if (!item) {
      return res.status(404).json({
        message: 'Item not found'
      })
    }

    if (item.userId.toString() !== req.user.id) {
      return res.status(403).json({
        message: 'You can update only your own item'
      })
    }

    item.status = status

    await item.save()

    res.status(200).json({
      message: 'Item status updated successfully',
      item
    })
  } catch (error) {
    console.log('UPDATE STATUS ERROR:')
    console.log(error)

    res.status(500).json({
      message: 'Failed to update item status',
      error: error.message
    })
  }
})

router.get('/user/items', authMiddleware, async (req, res) => {
  try {
    const items = await Item.find({
      userId: req.user.id
    }).sort({
      createdAt: -1
    })

    res.status(200).json(items)
  } catch (error) {
    console.log('USER ITEMS ERROR:')
    console.log(error)

    res.status(500).json({
      message: 'Failed to fetch your items',
      error: error.message
    })
  }
})

router.get('/', async (req, res) => {
  try {
    const items = await Item.find().sort({
      createdAt: -1
    })

    res.status(200).json(items)
  } catch (error) {
    console.log('GET ITEMS ERROR:')
    console.log(error)

    res.status(500).json({
      message: 'Failed to fetch items',
      error: error.message
    })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)

    if (!item) {
      return res.status(404).json({
        message: 'Item not found'
      })
    }

    res.status(200).json(item)
  } catch (error) {
    console.log('ITEM DETAILS ERROR:')
    console.log(error)

    res.status(500).json({
      message: 'Failed to fetch item details',
      error: error.message
    })
  }
})

module.exports = router

