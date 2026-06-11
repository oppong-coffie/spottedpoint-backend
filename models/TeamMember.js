const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  bio: { type: String },
  photo: { type: String },
  photoPublicId: { type: String },
  social: {
    linkedin: String,
    twitter: String,
    instagram: String,
  },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamSchema);