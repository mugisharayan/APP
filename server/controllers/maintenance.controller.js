import MaintenanceRequest from '../models/maintenanceRequest.model.js';

/**
 * @desc    Create a new maintenance request
 * @route   POST /api/maintenance
 * @access  Private
 */
const createMaintenanceRequest = async (req, res) => {
  // Note: This requires authentication middleware (req.user)
  const { hostel, description } = req.body;

  try {
    const request = new MaintenanceRequest({
      student: req.user._id,
      hostel,
      description,
    });

    const createdRequest = await request.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export { createMaintenanceRequest };