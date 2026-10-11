
const express = require('express')
const mongoose = require('mongoose')
const Booking = require('../models/Booking')
const authMiddleware = require('../middleware/auth')

const router = express.Router()

// Get bookings for the logged-in user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({
      userId: req.userId
    }).sort({ bookedAt: -1 })

    res.json(bookings)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to load bookings.'
    })
  }
})

// Save a new booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, details } = req.body

    if (!['Flight', 'Hotel', 'Cab'].includes(type)) {
      return res.status(400).json({
        message: 'Invalid booking type.'
      })
    }

    if (!details || typeof details !== 'object') {
      return res.status(400).json({
        message: 'Booking details are required.'
      })
    }

    const booking = await Booking.create({
      userId: req.userId,
      type,
      details,
      status: 'Confirmed'
    })

    res.status(201).json(booking)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to save booking.'
    })
  }
})

// Cancel a booking belonging to the logged-in user
router.patch('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid booking ID.'
      })
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.userId
    })

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found.'
      })
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({
        message: 'This booking is already cancelled.'
      })
    }

    booking.status = 'Cancelled'
    await booking.save()

    res.json(booking)
  } catch (error) {
    res.status(500).json({
      message: 'Failed to cancel booking.'
    })
  }
})

module.exports = router
