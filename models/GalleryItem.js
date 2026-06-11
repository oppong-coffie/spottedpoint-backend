const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String },
  type: { type: String, enum: ['image', 'video'], default: 'image' },
  url: { type: String, required: true },
  publicId: { type: String },
  thumbnail: { type: String },
  category: { type: String, default: 'General' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('GalleryItem', gallerySchema);