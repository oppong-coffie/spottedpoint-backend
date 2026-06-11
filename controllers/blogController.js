const BlogPost = require('../models/BlogPost');
const { cloudinary } = require('../config/cloudinary');

const slugify = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const getPosts = async (req, res) => {
  const filter = req.user ? {} : { published: true };
  const posts = await BlogPost.find(filter).sort({ createdAt: -1 });
  res.json(posts);
};

const getPost = async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug });
  if (!post) return res.status(404).json({ message: 'Not found' });
  res.json(post);
};

const createPost = async (req, res) => {
  const { title, excerpt, content, tag, author, readTime, published } = req.body;
  const coverImage = req.file ? req.file.path : '';
  const coverImagePublicId = req.file ? req.file.filename : '';
  const post = await BlogPost.create({ title, slug: slugify(title) + '-' + Date.now(), excerpt, content, coverImage, coverImagePublicId, tag, author, readTime, published: published === 'true' });
  res.status(201).json(post);
};

const updatePost = async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Not found' });
  if (req.file && post.coverImagePublicId) await cloudinary.uploader.destroy(post.coverImagePublicId);
  Object.assign(post, req.body);
  post.published = req.body.published === 'true';
  if (req.file) { post.coverImage = req.file.path; post.coverImagePublicId = req.file.filename; }
  const updated = await post.save();
  res.json(updated);
};

const deletePost = async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Not found' });
  if (post.coverImagePublicId) await cloudinary.uploader.destroy(post.coverImagePublicId);
  await post.deleteOne();
  res.json({ message: 'Deleted' });
};

module.exports = { getPosts, getPost, createPost, updatePost, deletePost };