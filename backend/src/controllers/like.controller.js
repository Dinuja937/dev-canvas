import Like from '../models/Like.js';
import Project from '../models/Project.js';
import eventBus from '../events/eventBus.js';
import mongoose from 'mongoose';

const getAuthenticatedUserId = (req) => req.user.id || req.user._id;

const isValidProjectId = (projectId) => mongoose.Types.ObjectId.isValid(projectId);

export const toggleLike = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = getAuthenticatedUserId(req);

    if (!isValidProjectId(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project id' });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const existingLike = await Like.findOne({ projectId, userId });

    if (existingLike) {
      await existingLike.deleteOne();
      return res.json({ success: true, liked: false });
    }

    await Like.create({ projectId, userId });

    eventBus.emit('project:liked', {
      project,
      likedBy: req.user,
    });

    return res.status(201).json({ success: true, liked: true });
  } catch (err) {
    return next(err);
  }
};

export const getProjectLikeStatus = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = getAuthenticatedUserId(req);

    if (!isValidProjectId(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project id' });
    }

    const liked = await Like.exists({ projectId, userId });

    return res.json({ success: true, liked: Boolean(liked) });
  } catch (err) {
    return next(err);
  }
};

export const getProjectLikeCount = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    if (!isValidProjectId(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project id' });
    }

    const count = await Like.countDocuments({ projectId });

    return res.json({ success: true, count });
  } catch (err) {
    return next(err);
  }
};

export const getLikedProjects = async (req, res, next) => {
  try {
    const userId = getAuthenticatedUserId(req);

    const likedProjects = await Like.find({ userId })
      .populate({
        path: 'projectId',
        populate: {
          path: 'studentId',
          select: 'name email profilePic',
        },
      })
      .sort({ createdAt: -1 });

    const projects = likedProjects
      .map((like) => like.projectId)
      .filter(Boolean);

    return res.json({ success: true, projects });
  } catch (err) {
    return next(err);
  }
};
