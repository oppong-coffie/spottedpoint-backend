const TeamMember = require('../models/TeamMember');
const { cloudinary } = require('../config/cloudinary');

const getTeam = async (req, res) => {
  const members = await TeamMember.find().sort({ order: 1 });
  res.json(members);
};

const addMember = async (req, res) => {
  const { name, role, bio, social, order } = req.body;
  const photo = req.file ? req.file.path : '';
  const photoPublicId = req.file ? req.file.filename : '';

  let parsedSocial = {};
  if (social) {
    if (typeof social === 'string') {
      try {
        parsedSocial = JSON.parse(social);
      } catch (err) {
        console.error('Failed to parse social JSON in addMember:', err);
      }
    } else {
      parsedSocial = social;
    }
  }

  const member = await TeamMember.create({ 
    name, 
    role, 
    bio, 
    photo, 
    photoPublicId, 
    social: parsedSocial, 
    order: Number(order) || 0 
  });
  res.status(201).json(member);
};

const updateMember = async (req, res) => {
  const member = await TeamMember.findById(req.params.id);
  if (!member) return res.status(404).json({ message: 'Not found' });
  
  if (req.file && member.photoPublicId) await cloudinary.uploader.destroy(member.photoPublicId);

  // Parse social JSON before Object.assign so Mongoose receives an object instead of a string
  if (req.body.social) {
    if (typeof req.body.social === 'string') {
      try {
        req.body.social = JSON.parse(req.body.social);
      } catch (err) {
        console.error('Failed to parse social JSON in updateMember:', err);
      }
    }
  }

  Object.assign(member, req.body);
  if (req.file) { 
    member.photo = req.file.path; 
    member.photoPublicId = req.file.filename; 
  }

  const updated = await member.save();
  res.json(updated);
};

const deleteMember = async (req, res) => {
  const member = await TeamMember.findById(req.params.id);
  if (!member) return res.status(404).json({ message: 'Not found' });
  if (member.photoPublicId) await cloudinary.uploader.destroy(member.photoPublicId);
  await member.deleteOne();
  res.json({ message: 'Deleted' });
};

module.exports = { getTeam, addMember, updateMember, deleteMember };