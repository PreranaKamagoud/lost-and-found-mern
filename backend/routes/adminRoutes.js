const express = require('express')
const Item = require('../models/Item')
const User = require('../models/User')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')

const router = express.Router()

router.use(authMiddleware)
router.use(adminMiddleware)

router.get('/stats', async (req, res) => {
  try {
    const totalItems = await Item.countDocuments()
    const lostItems = await Item.countDocuments({ type: 'lost' })
    const foundItems = await Item.countDocuments({ type: 'found' })
    const claimedItems = await Item.countDocuments({ status: 'CLAIMED' })
    const closedItems = await Item.countDocuments({ status: 'CLOSED' })

    res.status(200).json({
      totalItems,
      lostItems,
      foundItems,
      claimedItems,
      closedItems
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch admin statistics',
      error: error.message
    })
  }
})

router.get('/items', async (req, res) => {
  try {
    const items = await Item.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })

    res.status(200).json(items)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch all items',
      error: error.message
    })
  }
})

router.put('/items/:id/approve', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)

    if (!item) {
      return res.status(404).json({
        message: 'Item not found'
      })
    }

    item.approved = true
    item.rejected = false

    await item.save()

    res.status(200).json({
      message: 'Item approved successfully',
      item
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to approve item',
      error: error.message
    })
  }
})

router.put('/items/:id/reject', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)

    if (!item) {
      return res.status(404).json({
        message: 'Item not found'
      })
    }

    item.approved = false
    item.rejected = true

    await item.save()

    res.status(200).json({
      message: 'Item rejected successfully',
      item
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to reject item',
      error: error.message
    })
  }
})

router.delete('/items/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)

    if (!item) {
      return res.status(404).json({
        message: 'Item not found'
      })
    }

    await Item.findByIdAndDelete(req.params.id)

    res.status(200).json({
      message: 'Item removed successfully'
    })
  } catch (error) {
    res.status(500).json({
      message: 'Failed to remove item',
      error: error.message
    })
  }
})

router.get('/closed-items', async (req, res) => {
  try {
    const items = await Item.find({
      status: {
        $in: ['CLAIMED', 'CLOSED']
      }
    })
      .populate('userId', 'name email')
      .sort({ updatedAt: -1 })

    res.status(200).json(items)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch claimed and closed items',
      error: error.message
    })
  }
})

module.exports = router