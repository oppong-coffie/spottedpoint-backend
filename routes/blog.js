const express = require('express');
const router = express.Router();
const { getPosts, getPost, createPost, updatePost, deletePost } = require('../controllers/blogController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getPosts);
router.get('/:slug', getPost);
router.post('/', protect, upload.single('coverImage'), createPost);
router.put('/:id', protect, upload.single('coverImage'), updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;