const express = require('express');
const router = express.Router();
const { getTeam, addMember, updateMember, deleteMember } = require('../controllers/teamController');
const { protect } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.get('/', getTeam);
router.post('/', protect, upload.single('photo'), addMember);
router.put('/:id', protect, upload.single('photo'), updateMember);
router.delete('/:id', protect, deleteMember);

module.exports = router;