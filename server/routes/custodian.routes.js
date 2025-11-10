import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import User from '../models/user.model.js';
import Hostel from '../models/hostel.model.js';
import Booking from '../models/booking.model.js';
import Payment from '../models/payment.model.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Create new hostel
router.post('/create-hostel', protect, async (req, res) => {
  try {
    const { name, location, description, contact, amenities, rooms, images, priceRange } = req.body;
    
    // Check if custodian already has a hostel
    const existingHostel = await Hostel.findOne({ custodian: req.user._id });
    if (existingHostel) {
      return res.status(400).json({
        success: false,
        message: 'You already have a hostel registered'
      });
    }
    
    // Check if hostel name already exists
    const nameExists = await Hostel.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (nameExists) {
      return res.status(400).json({
        success: false,
        message: 'Hostel name already exists'
      });
    }
    
    // Create slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    // Validate and format amenities
    const formattedAmenities = (amenities || []).map(amenity => {
      if (typeof amenity === 'string') {
        return { name: amenity, icon: 'fa-check' };
      }
      return { name: amenity.name, icon: amenity.icon || 'fa-check' };
    });

    // Validate and format rooms
    const formattedRooms = (rooms || []).map(room => ({
      name: room.name,
      price: Number(room.price),
      description: room.description || '',
      icon: room.icon || 'fa-bed'
    }));

    // Create new hostel
    const hostel = await Hostel.create({
      name,
      location,
      description,
      contact,
      amenities: formattedAmenities,
      rooms: formattedRooms,
      images: images || [],
      priceRange: {
        min: Number(priceRange.min),
        max: Number(priceRange.max)
      },
      totalRooms: formattedRooms.length,
      slug,
      custodian: req.user._id
    });
    
    res.status(201).json({
      success: true,
      data: hostel,
      message: 'Hostel created successfully'
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
    // Find hostel owned by this custodian
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    
    if (!hostel) {
      return res.json({
        success: true,
        data: null,
        message: 'No hostel found. Please create a hostel first.'
      });
    }
    
    // Get bookings for this hostel
    const bookings = await Booking.find({ 
      $or: [
        { hostel: hostel._id },
        { hostelName: hostel.name }
      ]
    }).populate('student', 'name email phone');
    
    // Get payments for this hostel
    const payments = await Payment.find({ 
      $or: [
        { hostel: hostel._id },
        { hostelName: hostel.name }
      ]
    });
    
    // Calculate analytics data
    const analytics = await calculateHostelAnalytics(hostel._id, bookings, payments);
    
    res.json({
      success: true,
      data: {
        hostel,
        bookings,
        payments,
        analytics,
        stats: {
          totalRooms: hostel.totalRooms || 0,
          occupiedRooms: bookings.filter(b => b.status === 'active').length,
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

// Get my hostel
router.get('/my-hostel', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    
    if (!hostel) {
      return res.json({
        success: true,
        data: null,
        message: 'No hostel found'
      });
    }
    
    res.json({
      success: true,
      data: hostel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Update hostel
router.put('/update-hostel', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOneAndUpdate(
      { custodian: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }
    
    res.json({
      success: true,
      data: hostel,
      message: 'Hostel updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get bookings for custodian's hostel
router.get('/bookings', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    if (!hostel) {
      return res.json({ success: true, data: [] });
    }
    
    const bookings = await Booking.find({ 
      $or: [
        { hostel: hostel._id },
        { hostelName: hostel.name }
      ]
    }).populate('student', 'name email phone').sort({ createdAt: -1 });
    
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get payments for custodian's hostel
router.get('/payments', protect, async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ custodian: req.user._id });
    if (!hostel) {
      return res.json({ success: true, data: [] });
    }
    
    const payments = await Payment.find({ 
      $or: [
        { hostel: hostel._id },
        { hostelName: hostel.name }
      ]
    }).sort({ createdAt: -1 });
    
    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Calculate hostel analytics
async function calculateHostelAnalytics(hostelId, bookings = null, payments = null) {
  try {
    if (!bookings) {
      bookings = await Booking.find({ 
        $or: [{ hostel: hostelId }, { hostelName: { $exists: true } }]
      });
    }
    if (!payments) {
      payments = await Payment.find({ 
        $or: [{ hostel: hostelId }, { hostelName: { $exists: true } }]
      });
    }
    
    const totalRevenue = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);
    
    const currentMonth = new Date().getMonth();
    const monthlyRevenue = payments
      .filter(p => new Date(p.createdAt).getMonth() === currentMonth && p.status === 'completed')
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);
    
    const totalBookings = bookings.length;
    const activeBookings = bookings.filter(b => {
      const endDate = new Date(b.endDate);
      return endDate > new Date() && b.status !== 'cancelled';
    }).length;
    
    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    
    return {
      totalRevenue,
      monthlyRevenue,
      totalBookings,
      activeBookings,
      pendingPayments,
      pendingBookings,
      occupancyRate: totalBookings > 0 ? Math.round((activeBookings / totalBookings) * 100) : 0
    };
  } catch (error) {
    console.error('Analytics calculation error:', error);
    return {
      totalRevenue: 0,
      monthlyRevenue: 0,
      totalBookings: 0,
      activeBookings: 0,
      pendingPayments: 0,
      pendingBookings: 0,
      occupancyRate: 0
    };
  }
}

export default router;