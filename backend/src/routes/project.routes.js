// CRUD routes for projects
import express from 'express';
import multer from 'multer';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from '../controllers/project.controller.js';
import authMiddleware, { optionalAuthMiddleware } from '../middleware/auth.middleware.js';
import roleMiddleware from '../middleware/role.middleware.js';

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only JPEG, PNG, and WEBP images are allowed.'), false);
    }
  }
});

const projectUpload = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'extraImages', maxCount: 10 },
]);

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('STUDENT'), projectUpload, createProject);
router.get('/', optionalAuthMiddleware, getProjects);
router.get('/:id', getProjectById);
router.put('/:id', authMiddleware, roleMiddleware('STUDENT'), projectUpload, updateProject);
router.delete('/:id', authMiddleware, roleMiddleware('STUDENT'), deleteProject);

export default router;

