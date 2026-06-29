// Create, read, update, delete project logic
import Project from '../models/Project.js';
import { eventBus } from '../events/eventBus.js';
import cloudinary from '../lib/cloudinary.js'; 

// Helper: upload a file buffer to Cloudinary
const uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
};

export const createProject = async (req, res) => {
  try {
    let coverImageUrl = '';
    let extraImageUrls = [];

    // Upload cover image if provided
    if (req.files?.coverImage?.[0]) {
      coverImageUrl = await uploadToCloudinary(
        req.files.coverImage[0].buffer,
        'dev-canvas/projects'
      );
    }

    // Upload extra images if provided
    if (req.files?.extraImages?.length) {
      extraImageUrls = await Promise.all(
        req.files.extraImages.map((file) =>
          uploadToCloudinary(file.buffer, 'dev-canvas/projects/extras')
        )
      );
    }

    const project = new Project({
      ...req.body,
      studentId: req.user.id,
      coverImage: coverImageUrl,
      extraImages: extraImageUrls,
    });

    await project.save();
    
    
    eventBus.emit("project:created", {
      project,
      creator: req.user,
    });
    
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

    // Upload new cover image if provided
    if (req.files?.coverImage?.[0]) {
      project.coverImage = await uploadToCloudinary(
        req.files.coverImage[0].buffer,
        'dev-canvas/projects'
      );
    }

    // Upload new extra images if provided
    if (req.files?.extraImages?.length) {
      project.extraImages = await Promise.all(
        req.files.extraImages.map((file) =>
          uploadToCloudinary(file.buffer, 'dev-canvas/projects/extras')
        )
      );
    }

    // Update text fields
    const { title, description } = req.body;
    if (title) project.title = title;
    if (description) project.description = description;

    await project.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

};
