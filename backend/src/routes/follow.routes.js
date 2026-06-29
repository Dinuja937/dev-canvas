import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';
import {
  toggleFollow,
  getFollowStatus,
  getFollowerCount,
} from '../controllers/follow.controller.js';

const router = express.Router();

router.post(
  '/:userId/toggle',
  authMiddleware,
  roleMiddleware('RECRUITER'),
  toggleFollow
);

router.get(
  '/:userId/status',
  authMiddleware,
  roleMiddleware('RECRUITER'),
  getFollowStatus
);

router.get(
  '/:userId/count',
  authMiddleware,
  roleMiddleware('RECRUITER'),
  getFollowerCount
);

export default router;
