import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import User from '../models/user.model.js';
import Hostel from '../models/hostel.model.js';
import Booking from '../models/booking.model.js';
import Payment from '../models/payment.model.js';
import bcrypt from 'bcryptjs';

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

// Get custodian profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update custodian profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, email, phone, profilePicture } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, phone, profilePicture },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json({
      success: true,
      data: user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Change password
router.put('/change-password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Check current password
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password updated successfully'
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