# Member 4: Admin Dashboard & Moderation Task Sheet

* **Branch Name**: `feat/member4-admin-moderation`
* **Focus Area**: Moderation portal for system admins to inspect active accounts and delete inappropriate listings.

---

## 1. Branch Setup
Execute the following commands in your terminal:
```bash
git checkout main
git pull origin main
git checkout -b feat/member4-admin-moderation
```

---

## 2. Backend Tasks

### File to create: `backend/src/controllers/admin.controller.js`
Implement moderation endpoints:
* `getAllUsers`: Returns details of all registered user documents.
* `getAllProjects`: Returns all project submissions.
* `deleteProject`: Deletes any project document from the database.

### File to create: `backend/src/routes/admin.routes.js`
* Secure all routes with both `authMiddleware` and `roleMiddleware('ADMIN')`:
  ```javascript
  import express from 'express';
  import authMiddleware from '../middleware/auth.middleware.js';
  import roleMiddleware from '../middleware/role.middleware.js';
  import { getAllUsers, getAllProjects, deleteProject } from '../controllers/admin.controller.js';
  
  const router = express.Router();
  router.use(authMiddleware, roleMiddleware('ADMIN'));
  
  router.get('/users', getAllUsers);
  router.get('/projects', getAllProjects);
  router.delete('/projects/:id', deleteProject);
  
  export default router;
  ```

### File to modify: `backend/src/app.js`
* Mount the router under the `/api/admin` path:
  ```javascript
  import adminRoutes from './routes/admin.routes.js';
  app.use('/api/admin', adminRoutes);
  ```

---

## 3. Frontend Tasks

### File to create: `frontend/src/api/admin.api.js`
Expose endpoints:
* `getAllUsers()` -> `api.get('/admin/users')`
* `getAllProjects()` -> `api.get('/admin/projects')`
* `adminDeleteProject(id)` -> `api.delete('/admin/projects/' + id)`

### File to create: `frontend/src/pages/AdminPage.jsx`
* A layout shell displaying two primary tabs: **Users** and **Projects**.
* List all registered users (showing avatar, name, email, role).
* List all published projects with the project's cover image and a red "Remove Project" button triggering `adminDeleteProject(id)`.

### File to modify: `frontend/src/routing/navigationConfig.js`
Register the route for the `ADMIN` role:
```javascript
ADMIN: [
  { label: 'Browse Projects', path: '/', end: true },
  { label: 'Manage Portal', path: '/admin' }
]
```

---

## 4. Verification Check
Run compilation checks before opening a Pull Request:
* Backend: Start server with `npm run dev` to verify imports and routes are correct.
* Frontend: Compile production bundle with `npm run build` to verify syntax.
