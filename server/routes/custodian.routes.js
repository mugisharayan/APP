import express from 'express';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Link custodian to existing hostel
router.post('/link-hostel', protect, async (req, res) => {
  try {
    const { hostelName } = req.body;
    
    // Find hostel by name (case-insensitive)
    const hostel = await Hostel.findOne({ 
      name: { $regex: new RegExp(hostelName, 'i') } 
    }).populate('rooms bookings payments');
    
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found in database'
      });
    }
    
    // Update user to be custodian of this hostel
    await User.findByIdAndUpdate(req.user._id, {
      role: 'custodian',
      managedHostel: hostel._id,
      hostelName: hostel.name
    });
    
    // Calculate analytics data
    const analytics = await calculateHostelAnalytics(hostel._id);
    
    res.json({
      success: true,
      data: {
        hostel,
        analytics
      },
      message: 'Successfully linked to hostel'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get custodian dashboard data
router.get('/dashboard-data', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.managedHostel) {
      return res.status(400).json({
        success: false,
        message: 'No hostel linked to this custodian'
      });
    }
    
    const hostel = await Hostel.findById(user.managedHostel)
      .populate('rooms bookings payments');
    
    const analytics = await calculateHostelAnalytics(hostel._id);
    
    res.json({
      success: true,
      data: {
        hostel,
        analytics,
        stats: {
          totalRooms: hostel.rooms?.length || 0,
          occupiedRooms: hostel.rooms?.filter(r => r.status === 'occupied').length || 0,
          totalRevenue: analytics.totalRevenue,
          monthlyRevenue: analytics.monthlyRevenue,
          totalBookings: analytics.totalBookings,
          activeBookings: analytics.activeBookings
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Calculate hostel analytics
async function calculateHostelAnalytics(hostelId) {
  const bookings = await Booking.find({ hostel: hostelId });
  const payments = await Payment.find({ hostel: hostelId });
  
  const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const currentMonth = new Date().getMonth();
  const monthlyRevenue = payments
    .filter(p => new Date(p.createdAt).getMonth() === currentMonth)
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => {
    const endDate = new Date(b.endDate);
    return endDate > new Date() && b.status !== 'cancelled';
  }).length;
  
  return {
    totalRevenue,
    monthlyRevenue,
    totalBookings,
    activeBookings,
    occupancyRate: totalBookings > 0 ? Math.round((activeBookings / totalBookings) * 100) : 0
  };
}

export default router;