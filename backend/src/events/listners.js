import eventBus from './eventBus.js';
import {
  createProjectNotification,
  createLikeNotification,
} from '../services/notification.service.js';

eventBus.on("project:created", async ({ project, creator }) => {
  await createProjectNotification(project, creator);
});

eventBus.on("project:liked", async ({ project, likedBy }) => {
  await createLikeNotification(project, likedBy);
});
