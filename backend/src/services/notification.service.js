import Notification from '../models/Notification.js';

export const createProjectNotification = async (project, creator) => {
  return Notification.create({
    userId: creator.id || creator._id,
    message: `Your project "${project.title}" was created successfully.`
  });
};

export const createLikeNotification = async (project, likedBy) => {
  return Notification.create({
    userId: project.studentId,
    message: `${likedBy.name} liked your project "${project.title}".`
  });
};
