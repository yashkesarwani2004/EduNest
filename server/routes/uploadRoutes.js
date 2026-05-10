import express from 'express';
import upload from '../config/cloudinary.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.array('images', 5), (req, res) => {
  try {
    const urls = req.files.map(file => file.path);
    res.status(200).json({
      success: true,
      data: urls
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Image upload failed' });
  }
});

export default router;
