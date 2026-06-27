// Create, read, update, delete project logic
import { Project } from '../models/project.model.js';
import { eventBus } from '../lib/eventBus.js';

export const createProject = async (req, res) => {
  try {
    const project = new Project({ ...req.body, studentId: req.user.id });
    await project.save();
    eventBus.emit('project:created', project);
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate('studentId', 'name email profilePic');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate('studentId', 'name email profilePic');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.studentId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    Object.assign(project, req.body);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.studentId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    await project.deleteOne();
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};