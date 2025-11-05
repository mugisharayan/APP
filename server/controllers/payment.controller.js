import Payment from '../models/payment.model.js';
import Booking from '../models/booking.model.js';

/**
 * @desc    Create a payment for a booking
 * @route   POST /api/payments/booking/:bookingId
 * @access  Private
 */
const createPaymentForBooking = async (req, res) => {
  // Note: This requires authentication middleware (req.user)
  const { amount, paymentMethod, transactionId } = req.body;
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const payment = new Payment({
      booking: bookingId,
      student: req.user._id,
      amount,
      paymentMethod,
      transactionId, // In a real app, this would come from a payment gateway
      status: 'Completed',
    });

    const createdPayment = await payment.save();

    // Link payment to the booking
    booking.payment = createdPayment._id;
    await booking.save();

    res.status(201).json(createdPayment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export { createPaymentForBooking };