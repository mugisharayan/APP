import express from 'express';
import {
  getHostels,
  getHostelById,
  getHostelBySlug,
  createHostelReview,
} from '../controllers/hostel.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.route('/').get(getHostels);
router.route('/slug/:slug').get(getHostelBySlug);
router.route('/:id').get(getHostelById);
router.route('/:id/reviews').post(protect, createHostelReview);

export default router;