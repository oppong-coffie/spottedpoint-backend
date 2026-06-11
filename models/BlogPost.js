const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  excerpt: { type: String },
  content: { type: String },
  coverImage: { type: String },
  coverImagePublicId: { type: String },
  tag: { type: String },
  author: { type: String, default: 'Spotted Point Media' },
  readTime: { type: String },
  published: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', blogSchema);