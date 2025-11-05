import Booking from '../models/booking.model.js';
import asyncHandler from 'express-async-handler';

/**
 * @desc    Create new booking
 * @route   POST /api/bookings
 * @access  Private
 */
const createBooking = asyncHandler(async (req, res) => {
  // Note: This requires authentication middleware (req.user)
  const { hostel, room, startDate, endDate } = req.body;

  if (!hostel || !room || !startDate || !endDate) {
    res.status(400);
    throw new Error('Please provide all booking details');
  }

  const booking = new Booking({
    student: req.user._id,
    hostel,
    room,
    startDate,
    endDate,
  });

  const createdBooking = await booking.save();
  res.status(201).json(createdBooking);
});

/**
 * @desc    Get logged in user's bookings
 * @route   GET /api/bookings/my-bookings
 * @access  Private
 */
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ student: req.user._id }).populate('hostel', 'name');
  res.json(bookings);
});

export { createBooking, getMyBookings };