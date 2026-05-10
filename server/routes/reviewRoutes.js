import express from 'express';
import Review from '../models/Review.js';
import Institute from '../models/Institute.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get reviews for an institute
// @route   GET /api/reviews?instituteId=xxx
// @access  Public
router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.query.instituteId) {
      query.institute = req.query.instituteId;
    }

    const reviews = await Review.find(query).populate('user', 'name avatar');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Add review
// @route   POST /api/reviews
// @access  Private (User role only)
router.post('/', protect, authorize('user'), async (req, res) => {
  try {
    req.body.user = req.user.id;
    
    // Check if institute exists
    const institute = await Institute.findById(req.body.institute);
    if (!institute) {
      return res.status(404).json({ success: false, message: `No institute found with id ${req.body.institute}` });
    }

    // Check if user already submitted a review
    const alreadyReviewed = await Review.findOne({
      institute: req.body.institute,
      user: req.user.id
    });

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this institute' });
    }

    const review = await Review.create(req.body);

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    if (error.code === 11000) {
       return res.status(400).json({ success: false, message: 'You have already reviewed this institute' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
