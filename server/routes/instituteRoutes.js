import express from 'express';
import Institute from '../models/Institute.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all institutes
// @route   GET /api/institutes
// @access  Public
router.get('/', async (req, res) => {
  try {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit', 'lat', 'lng', 'radius', 'search'];
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Parse and handle specific fields
    const queryObj = JSON.parse(queryStr);
    
    // Name search (regex)
    if (req.query.search) {
      queryObj.name = { $regex: req.query.search, $options: 'i' };
    }

    // Geospatial search
    if (req.query.lat && req.query.lng) {
      const radius = req.query.radius ? parseInt(req.query.radius) : 10; // default 10km
      const radiusInRadians = radius / 6378.1; // Earth radius in km

      queryObj.location = {
        $geoWithin: {
          $centerSphere: [[parseFloat(req.query.lng), parseFloat(req.query.lat)], radiusInRadians]
        }
      };
    }

    // Finding resource
    query = Institute.find(queryObj);

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const total = await Institute.countDocuments(queryObj);

    query = query.skip(startIndex).limit(limit);

    // Executing query
    const institutes = await query;

    res.status(200).json({
      success: true,
      count: institutes.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total/limit)
      },
      data: institutes
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Get single institute
// @route   GET /api/institutes/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id).populate('owner', 'name email');

    if (!institute) {
      return res.status(404).json({ success: false, message: 'Institute not found' });
    }

    res.status(200).json({ success: true, data: institute });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @desc    Create new institute
// @route   POST /api/institutes
// @access  Private (Institute role only)
router.post('/', protect, authorize('institute'), async (req, res) => {
  try {
    req.body.owner = req.user.id;

    // Handle location structure
    if (req.body.lat && req.body.lng) {
      req.body.location = {
        type: 'Point',
        coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
      };
    }

    const institute = await Institute.create(req.body);

    res.status(201).json({
      success: true,
      data: institute
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Update institute
// @route   PUT /api/institutes/:id
// @access  Private (Institute owner only)
router.put('/:id', protect, authorize('institute'), async (req, res) => {
  try {
    let institute = await Institute.findById(req.params.id);

    if (!institute) {
      return res.status(404).json({ success: false, message: 'Institute not found' });
    }

    // Make sure user is institute owner
    if (institute.owner.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this institute' });
    }

    // Handle location structure if provided
    if (req.body.lat && req.body.lng) {
      req.body.location = {
        type: 'Point',
        coordinates: [parseFloat(req.body.lng), parseFloat(req.body.lat)]
      };
    }

    institute = await Institute.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: institute });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// @desc    Delete institute
// @route   DELETE /api/institutes/:id
// @access  Private (Institute owner only)
router.delete('/:id', protect, authorize('institute'), async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);

    if (!institute) {
      return res.status(404).json({ success: false, message: 'Institute not found' });
    }

    // Make sure user is institute owner
    if (institute.owner.toString() !== req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this institute' });
    }

    await institute.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
