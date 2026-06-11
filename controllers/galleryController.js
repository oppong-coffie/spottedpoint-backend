const GalleryItem = require('../models/GalleryItem');
const { cloudinary } = require('../config/cloudinary');

const getGallery = async (req, res) => {
  const items = await GalleryItem.find().sort({ order: 1, createdAt: -1 });
  res.json(items);
};

const uploadMedia = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const isVideo = req.file.mimetype?.startsWith('video/') || req.file.path?.includes('video');
  const item = await GalleryItem.create({
    title: req.body.title || '',
    type: isVideo ? 'video' : 'image',
    url: req.file.path,
    publicId: req.file.filename,
    thumbnail: isVideo ? req.body.thumbnail || '' : req.file.path,
    category: req.body.category || 'General',
    order: Number(req.body.order) || 0,
  });
  res.status(201).json(item);
};

const deleteMedia = async (req, res) => {
  const item = await GalleryItem.findById(req.params.id);
  if (!item) return res.status(404).json({ message: 'Not found' });
  if (item.publicId) {
    await cloudinary.uploader.destroy(item.publicId, { resource_type: item.type === 'video' ? 'video' : 'image' });
  }
  await item.deleteOne();
  res.json({ message: 'Deleted' });
};

module.exports = { getGallery, uploadMedia, deleteMedia };