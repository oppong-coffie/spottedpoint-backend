const express = require('express');
const router = express.Router();
const { register, login, getMe, getUsers, updateAdmin, deleteAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/', protect, getUsers);
router.put('/:id', protect, updateAdmin);
router.delete('/:id', protect, deleteAdmin);

module.exports = router;