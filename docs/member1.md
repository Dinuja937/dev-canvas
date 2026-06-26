# Member 1: Project Management (CRUD) Task Sheet

* **Branch Name**: `feat/member1-project-crud`
* **Focus Area**: Enabling students to create, read, update, and delete project posts.

---

## 1. Branch Setup
Execute the following commands in your terminal:
```bash
git checkout main
git pull origin main
git checkout -b feat/member1-project-crud
```

---

## 2. Backend Tasks

### File to create: `backend/src/controllers/project.controller.js`
Implement these async Express handlers:
* `createProject`: Saves a new `Project` document linked to `req.user.id`. Calls `eventBus.emit('project:created', project)` after saving.
* `getProjects`: Retrieves all projects (use `.populate('studentId', 'name email profilePic')`).
* `getProjectById`: Fetches a single project's details by ID parameter.
* `updateProject`: Edits project details (only if `studentId` matches `req.user.id`).
* `deleteProject`: Removes a project (only if `studentId` matches `req.user.id`).

### File to modify/create: `backend/src/routes/project.routes.js`
Configure Express routing:
* `POST /` -> Secure with `authMiddleware` -> Link `createProject`.
* `GET /` -> Public (or secured) -> Link `getProjects`.
* `GET /:id` -> Public -> Link `getProjectById`.
* `PUT /:id` -> Secure with `authMiddleware` -> Link `updateProject`.
* `DELETE /:id` -> Secure with `authMiddleware` -> Link `deleteProject`.

### File to modify: `backend/src/app.js`
* Import your project router:
  ```javascript
  import projectRoutes from './routes/project.routes.js';
  ```
* Mount it under the `/api/projects` path:
  ```javascript
  app.use('/api/projects', projectRoutes);
  ```

---

## 3. Frontend Tasks

### File to create: `frontend/src/api/project.api.js`
Create API calls using the custom `api` instance:
* `createProject(projectData)` -> `api.post('/projects', projectData)`
* `getProjects()` -> `api.get('/projects')`
* `getProject(id)` -> `api.get('/projects/' + id)`
* `updateProject(id, projectData)` -> `api.put('/projects/' + id, projectData)`
* `deleteProject(id)` -> `api.delete('/projects/' + id)`

### File to create: `frontend/src/pages/CreateProjectPage.jsx`
* Build a responsive form containing validation (Title, Description, Cover Image URL, extra image URLs).
* On submit, trigger `createProject()` and navigate to `/`.

### File to create: `frontend/src/pages/EditProjectPage.jsx`
* Fetch project details using `getProject(id)` on load.
* Populate form values, allow edits, and submit updates via `updateProject(id)`.

### File to modify: `frontend/src/routing/navigationConfig.js`
Ensure the links are registered for the `STUDENT` role:
```javascript
STUDENT: [
  { label: 'Browse Projects', path: '/', end: true },
  { label: 'My Portfolio', path: '/my-portfolio' },
  { label: 'Upload Project', path: '/upload' },
]
```

---

## 4. Verification Check
Run compilation checks before opening a Pull Request:
* Backend: Start server with `npm run dev` to verify imports and routes are correct.
* Frontend: Compile production bundle with `npm run build` to verify syntax.
