import express from 'express';
import {
  createBooking,
  getMyBookings,
} from '../controllers/booking.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/').post(protect, createBooking);
router.route('/my-bookings').get(protect, getMyBookings);

export default router;