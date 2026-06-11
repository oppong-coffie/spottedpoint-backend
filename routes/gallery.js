const express = require('express');
const router = express.Router();
const { getGallery, uploadMedia, deleteMedia } = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getGallery);
router.post('/', protect, upload.single('file'), uploadMedia);
router.delete('/:id', protect, deleteMedia);

module.exports = router;
