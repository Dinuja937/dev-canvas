import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';
import {
  toggleLike,
  getProjectLikeStatus,
  getProjectLikeCount,
} from '../controllers/like.controller.js';

const router = express.Router();

router.post(
  '/:projectId/toggle',
  authMiddleware,
  roleMiddleware('RECRUITER'),
  toggleLike
);

router.get(
  '/:projectId/status',
  authMiddleware,
  roleMiddleware('RECRUITER'),
  getProjectLikeStatus
);

router.get(
  '/:projectId/count',
  authMiddleware,
  roleMiddleware('RECRUITER'),
  getProjectLikeCount
);

export default router;
