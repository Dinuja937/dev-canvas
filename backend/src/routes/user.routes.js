import express from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { updateProfile, getUserById } from '../controllers/user.controller.js';

const router = express.Router();

router.put('/profile', authMiddleware, updateProfile);
router.get('/:id', authMiddleware, getUserById);

export default router;
