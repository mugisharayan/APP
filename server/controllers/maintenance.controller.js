import MaintenanceRequest from '../models/maintenanceRequest.model.js';

/**
 * @desc    Create a new maintenance request
 * @route   POST /api/maintenance
 * @access  Private
 */
const createMaintenanceRequest = async (req, res) => {
  const { category, roomNumber, description } = req.body;

  try {
    // Simple fallback: find first available hostel
    const Hostel = (await import('../models/hostel.model.js')).default;
    const hostel = await Hostel.findOne({});
    
    const request = new MaintenanceRequest({
      student: req.user._id,
      hostel: hostel?._id || null,
      category,
      roomNumber,
      description,
    });

    const createdRequest = await request.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getMyMaintenanceRequests = async (req, res) => {
  try {
    const requests = await MaintenanceRequest.find({ student: req.user._id })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export { createMaintenanceRequest, getMyMaintenanceRequests };