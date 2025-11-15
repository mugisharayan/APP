// Backend Controller - Hostel API Endpoints
// File: server/controllers/hostel.controller.js

import Hostel from '../models/hostel.model.js';
import Review from '../models/review.model.js';

/**
 * @desc    Fetch all hostels with search and filter capabilities
 * @route   GET /api/hostels
 * @access  Public
 */
const getHostels = async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { 
      search, 
      location, 
      minPrice, 
      maxPrice, 
      amenities,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build MongoDB query object
    let query = { isActive: true };

    // Text search across hostel name and description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Location filtering
    if (location && location !== 'all') {
      query.location = { $regex: location, $options: 'i' };
    }

    // Price range filtering (requires aggregation for room prices)
    let aggregationPipeline = [
      { $match: query },
      {
        $addFields: {
          minRoomPrice: {
            $min: "$rooms.price"
          }
        }
      }
    ];

    // Add price filtering to aggregation
    if (minPrice || maxPrice) {
      let priceMatch = {};
      if (minPrice) priceMatch.minRoomPrice = { $gte: parseInt(minPrice) };
      if (maxPrice) priceMatch.minRoomPrice = { ...priceMatch.minRoomPrice, $lte: parseInt(maxPrice) };
      aggregationPipeline.push({ $match: priceMatch });
    }

    // Amenities filtering
    if (amenities) {
      const amenityList = amenities.split(',');
      aggregationPipeline.push({
        $match: {
          "amenities.name": { $in: amenityList }
        }
      });
    }

    // Populate custodian information
    aggregationPipeline.push({
      $lookup: {
        from: 'users',
        localField: 'custodian',
        foreignField: '_id',
        as: 'custodian',
        pipeline: [{ $project: { name: 1, email: 1, phone: 1 } }]
      }
    });

    // Sort results
    const sortDirection = sortOrder === 'desc' ? -1 : 1;
    aggregationPipeline.push({
      $sort: { [sortBy]: sortDirection }
    });

    // Execute aggregation
    const hostels = await Hostel.aggregate(aggregationPipeline);
    
    // Calculate ratings for each hostel
    const hostelsWithRatings = await Promise.all(
      hostels.map(async (hostel) => {
        const reviews = await Review.find({ hostel: hostel._id });
        const averageRating = reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
          : 0;
        
        return {
          ...hostel,
          averageRating: Math.round(averageRating * 10) / 10,
          reviewCount: reviews.length,
          custodian: hostel.custodian[0] || null
        };
      })
    );
    
    res.json({
      success: true,
      count: hostelsWithRatings.length,
      data: hostelsWithRatings
    });

  } catch (error) {
    console.error('Error fetching hostels:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server Error',
      error: error.message 
    });
  }
};

/**
 * @desc    Fetch single hostel by ID
 * @route   GET /api/hostels/:id
 * @access  Public
 */
const getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id)
      .populate('custodian', 'name email phone');
      
    if (!hostel || !hostel.isActive) {
      return res.status(404).json({ 
        success: false,
        message: 'Hostel not found' 
      });
    }

    // Get reviews for this hostel
    const reviews = await Review.find({ hostel: hostel._id })
      .populate('student', 'name')
      .sort({ createdAt: -1 });

    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
      : 0;

    res.json({
      success: true,
      data: {
        ...hostel.toObject(),
        averageRating: Math.round(averageRating * 10) / 10,
        reviewCount: reviews.length,
        reviews
      }
    });

  } catch (error) {
    console.error('Error fetching hostel:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server Error',
      error: error.message 
    });
  }
};

export { getHostels, getHostelById };