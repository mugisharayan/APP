import express from 'express';
import { createPaymentForBooking } from '../controllers/payment.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/booking/:bookingId').post(protect, createPaymentForBooking);

export default router;