const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// START:: Register
const register = async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'User already exists' });
  const user = await User.create({ name, email, password, role: 'superadmin' });
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
};
  // END:: Register

// START:: Login
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await user.matchPassword(password)) {
    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, token: generateToken(user._id) });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};
// END:: Login

// START:: Get Me
const getMe = async (req, res) => res.json(req.user);
// END:: Get Me

// START:: Get Users
const getUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};
// END:: Get Users

// START:: Update Admin
const updateAdmin = async (req, res) => {
  const { name, email, password, role } = req.body;
  const admin = await User.findById(req.params.id);
  if (!admin) return res.status(404).json({ message: 'Admin not found' });

  if (email && email !== admin.email) {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });
  }

  if (name) admin.name = name;
  if (email) admin.email = email;
  if (role) admin.role = role;
  if (password) admin.password = password;

  const updatedAdmin = await admin.save();
  res.json({
    _id: updatedAdmin._id,
    name: updatedAdmin.name,
    email: updatedAdmin.email,
    role: updatedAdmin.role
  });
};
// END:: Update Admin

// START:: Delete Admin
const deleteAdmin = async (req, res) => {
  if (req.user._id.toString() === req.params.id) {
    return res.status(400).json({ message: 'You cannot delete your own account' });
  }

  const superadminCount = await User.countDocuments({ role: 'superadmin' });
  const adminToDelete = await User.findById(req.params.id);
  if (!adminToDelete) return res.status(404).json({ message: 'Admin not found' });

  if (adminToDelete.role === 'superadmin' && superadminCount <= 1) {
    return res.status(400).json({ message: 'Cannot delete the only remaining superadmin account' });
  }

  await adminToDelete.deleteOne();
  res.json({ message: 'Administrator deleted successfully' });
};
// END:: Delete Admin

module.exports = { register, login, getMe, getUsers, updateAdmin, deleteAdmin };