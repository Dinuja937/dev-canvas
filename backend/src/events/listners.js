import eventBus from './eventBus.js';
import {
  createProjectNotification,
  createLikeNotification,
  createFollowNotification,
} from '../services/notification.service.js';

eventBus.on("project:created", async ({ project, creator }) => {
  try {
    await createProjectNotification(project, creator);
  } catch (err) {
    console.error("Failed to create project notification:", err.message);
  }
});

eventBus.on("project:liked", async ({ project, likedBy }) => {
  try {
    await createLikeNotification(project, likedBy);
  } catch (err) {
    console.error("Failed to create like notification:", err.message);
  }
});

eventBus.on("user:followed", async ({ followerId, followingId }) => {
  try {
    await createFollowNotification(followerId, followingId);
  } catch (err) {
    console.error("Failed to create follow notification:", err.message);
  }
});
