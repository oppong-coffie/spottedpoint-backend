const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { upload, cloudinary } = require('../config/cloudinary');

// Generic single file upload endpoint
router.post('/upload', protect, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file' });
  res.json({ url: req.file.path, publicId: req.file.filename });
});

module.exports = router;