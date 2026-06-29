import Like from '../models/Like.js';
import Project from '../models/Project.js';
import eventBus from '../events/eventBus.js';

export const toggleProjectLikeService = async (projectId, user) => {
  const userId = user.id || user._id;

  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  const existingLike = await Like.findOne({ projectId, userId });

  if (existingLike) {
    await existingLike.deleteOne();
    return { liked: false };
  }

  await Like.create({ projectId, userId });

  eventBus.emit('project:liked', {
    project,
    likedBy: user,
  });

  return { liked: true };
};

export const getLikeStatusService = async (projectId, userId) => {
  const liked = await Like.exists({ projectId, userId });
  return Boolean(liked);
};

export const getLikeCountService = async (projectId) => {
  return await Like.countDocuments({ projectId });
};

export const getLikedProjectsService = async (userId) => {
  const likedProjects = await Like.find({ userId })
    .populate({
      path: 'projectId',
      populate: {
        path: 'studentId',
        select: 'name email profilePic',
      },
    })
    .sort({ createdAt: -1 });

  return likedProjects
    .map((like) => like.projectId)
    .filter(Boolean);
};
