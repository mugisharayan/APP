import Booking from '../models/booking.model.js';
import asyncHandler from 'express-async-handler';

/**
 * @desc    Create new booking
 * @route   POST /api/bookings
 * @access  Private
 */
const createBooking = asyncHandler(async (req, res) => {
  const { hostel, room, startDate, endDate } = req.body;

  if (!hostel || !room || !startDate || !endDate) {
    res.status(400);
    throw new Error('Please provide all booking details');
  }

  // Check for existing active bookings
  const existingBooking = await Booking.findOne({ 
    student: req.user._id,
    status: { $ne: 'cancelled' },
    endDate: { $gte: new Date() }
  });
  
  if (existingBooking) {
    res.status(400);
    throw new Error('You already have an active booking. Please cancel or wait for it to expire before booking again.');
  }

  // Handle both ObjectId and string inputs
  let hostelId = hostel;
  let roomId = room;
  
  // If hostel is a string (name), try to find by name
  if (typeof hostel === 'string' && !hostel.match(/^[0-9a-fA-F]{24}$/)) {
    const Hostel = (await import('../models/hostel.model.js')).default;
    const hostelDoc = await Hostel.findOne({ name: new RegExp(hostel, 'i') });
    if (hostelDoc) {
      hostelId = hostelDoc._id;
    }
  }
  
  // If room is a string (name), create a temporary room reference
  if (typeof room === 'string' && !room.match(/^[0-9a-fA-F]{24}$/)) {
    // For now, store room name directly - in production, you'd resolve to room ID
    roomId = room;
  }

  const booking = new Booking({
    student: req.user._id,
    hostel: hostelId,
    room: roomId,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
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
  const bookings = await Booking.find({ student: req.user._id })
    .populate('hostel', 'name location')
    .populate('room', 'name price type')
    .populate('payment', 'amount paymentMethod status');
  res.json(bookings);
});

/**
 * @desc    Cancel a booking
 * @route   PUT /api/bookings/:id/cancel
 * @access  Private
 */
const cancelBooking = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const booking = await Booking.findById(req.params.id);
  
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  
  if (booking.student.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }
  
  booking.status = 'cancelled';
  booking.cancellationReason = reason;
  booking.cancelledAt = new Date();
  await booking.save();
  
  res.json({ message: 'Booking cancelled successfully' });
});

export { createBooking, getMyBookings, cancelBooking };