import mongoose from 'mongoose';
import {
  toggleProjectLikeService,
  getLikeStatusService,
  getLikeCountService,
  getLikedProjectsService
} from '../services/like.service.js';

const getAuthenticatedUserId = (req) => req.user.id || req.user._id;

const isValidProjectId = (projectId) => mongoose.Types.ObjectId.isValid(projectId);

export const toggleLike = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    if (!isValidProjectId(projectId)) {
      return res.status(400).json({ success: false, message: 'Invalid project id' });
    }

    try {
      const result = await toggleProjectLikeService(projectId, req.user);
      return res.status(201).json({ success: true, ...result });
    } catch (err) {
      if (err.message === 'Project not found') {
        return res.status(404).json({ success: false, message: 'Project not found' });
      }
      throw err;
    }
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

    const liked = await getLikeStatusService(projectId, userId);
    return res.json({ success: true, liked });
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

    const count = await getLikeCountService(projectId);
    return res.json({ success: true, count });
  } catch (err) {
    return next(err);
  }
};

export const getLikedProjects = async (req, res, next) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const projects = await getLikedProjectsService(userId);
    return res.json({ success: true, projects });
  } catch (err) {
    return next(err);
  }
};
