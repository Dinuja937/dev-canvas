import Notification from '../models/Notification.js';
import Follower from '../models/Follower.js';

export const createProjectNotification = async (project, creator) => {
  // Find all followers of the creator
  const followers = await Follower.find({ followingId: creator._id || creator.id });

  // Create notifications for all followers
  const notificationPromises = followers.map((f) =>
    Notification.create({
      userId: f.followerId,
      message: `${creator.name} uploaded a new project: "${project.title}".`,
    })
  );

  // Also notify the creator of successful creation
  notificationPromises.push(
    Notification.create({
      userId: creator.id || creator._id,
      message: `Your project "${project.title}" was created successfully.`,
    })
  );

  return Promise.all(notificationPromises);
};

export const createLikeNotification = async (project, likedBy) => {
  return Notification.create({
    userId: project.studentId,
    message: `${likedBy.name} liked your project "${project.title}".`
  });
};
