import Hostel from '../models/hostel.model.js';
import Review from '../models/review.model.js';

/**
 * @desc    Fetch all hostels
 * @route   GET /api/hostels
 * @access  Public
 */
const getHostels = async (req, res) => {
  try {
    // Only return active hostels with custodian populated
    const hostels = await Hostel.find({ isActive: true })
      .populate('custodian', 'name email phone')
      .sort({ createdAt: -1 });
    
    // Calculate real ratings for each hostel
    const hostelsWithRatings = await Promise.all(
      hostels.map(async (hostel) => {
        const reviews = await Review.find({ hostel: hostel._id });
        const averageRating = reviews.length > 0 
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
          : 0;
        
        return {
          ...hostel.toObject(),
          averageRating: Math.round(averageRating * 10) / 10,
          reviewCount: reviews.length
        };
      })
    );
    
    res.json(hostelsWithRatings);
  } catch (error) {
    console.error('Error fetching hostels:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Fetch single hostel
 * @route   GET /api/hostels/:id
 * @access  Public
 */
const getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id)
      .populate('custodian', 'name email phone');
    if (hostel && hostel.isActive) {
      res.json(hostel);
    } else {
      res.status(404).json({ message: 'Hostel not found' });
    }
  } catch (error) {
    console.error('Error fetching hostel:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Fetch single hostel by slug
 * @route   GET /api/hostels/slug/:slug
 * @access  Public
 */
const getHostelBySlug = async (req, res) => {
  try {
    const hostel = await Hostel.findOne({ slug: req.params.slug, isActive: true })
      .populate('custodian', 'name email phone');
    if (hostel) {
      res.json(hostel);
    } else {
      res.status(404).json({ message: 'Hostel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Create a new review
 * @route   POST /api/hostels/:id/reviews
 * @access  Private
 */
const createHostelReview = async (req, res) => {
  // Note: This is a placeholder. A full implementation would require authentication
  // and would also update the hostel's average rating.
  const { rating, comment } = req.body;
  const hostel = await Hostel.findById(req.params.id);

  if (hostel) {
    // In a real app, you'd check if the user has already reviewed.
    const review = new Review({
      rating: Number(rating),
      comment,
      student: req.user._id, // from auth middleware
      hostel: req.params.id,
    });
    await review.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ message: 'Hostel not found' });
  }
};

export { getHostels, getHostelById, getHostelBySlug, createHostelReview };