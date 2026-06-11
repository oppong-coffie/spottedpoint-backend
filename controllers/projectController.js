const Project = require('../models/Project');
const { cloudinary } = require('../config/cloudinary');

const getProjects = async (req, res) => {
  const projects = await Project.find().sort({ order: 1, createdAt: -1 });
  res.json(projects);
};

const createProject = async (req, res) => {
  const { title, category, description, client, year, tags, featured, order } = req.body;
  const image = req.file ? req.file.path : '';
  const imagePublicId = req.file ? req.file.filename : '';
  const project = await Project.create({ title, category, description, client, year, image, imagePublicId, tags: tags ? tags.split(',') : [], featured: featured === 'true', order: Number(order) || 0 });
  res.status(201).json(project);
};

const updateProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Not found' });
  const { title, category, description, client, year, tags, featured, order } = req.body;
  if (req.file && project.imagePublicId) {
    await cloudinary.uploader.destroy(project.imagePublicId);
  }
  project.title = title || project.title;
  project.category = category || project.category;
  project.description = description || project.description;
  project.client = client || project.client;
  project.year = year || project.year;
  project.tags = tags ? tags.split(',') : project.tags;
  project.featured = featured !== undefined ? featured === 'true' : project.featured;
  project.order = order !== undefined ? Number(order) : project.order;
  if (req.file) { project.image = req.file.path; project.imagePublicId = req.file.filename; }
  const updated = await project.save();
  res.json(updated);
};

const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Not found' });
  if (project.imagePublicId) await cloudinary.uploader.destroy(project.imagePublicId);
  await project.deleteOne();
  res.json({ message: 'Deleted' });
};

module.exports = { getProjects, createProject, updateProject, deleteProject };