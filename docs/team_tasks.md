# Team Work Division & Implementation Guide

To prevent Git merge conflicts, the project has been structured using a decoupled layout (clean separated routes, controllers, and pages). We have established the central state and layout shell, so team members can now work on their assigned domains independently.

---

## Git Workflow Guidelines (For All Members)
1. **Pull Latest Changes**: Always start by checking out the main branch and pulling updates:
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Create Your Branch**: Create your feature branch using the specified naming convention:
   ```bash
   git checkout -b feat/member[X]-[feature-name]
   ```
3. **Commit Regularly**: Write clear, semantic commit messages (e.g. `feat(project): implement post project controller`).
4. **Push & Create PR**: Push your branch and open a Pull Request (PR) to merge into `main`:
   ```bash
   git push origin feat/member[X]-[feature-name]
   ```

---

## Member 1: Project Management (CRUD)
* **Branch Name**: `feat/member1-project-crud`
* **Focus Area**: Enabling students to create, read, update, and delete project posts.

### Backend Tasks
1. **Create Controller**: Write logic in `backend/src/controllers/project.controller.js`:
   - `createProject`: Create a new `Project` document linked to `req.user.id`.
   - `getProjects`: Retrieve all projects (populate the student details).
   - `getProjectById`: Fetch a single project details.
   - `updateProject`: Edit a project if `studentId === req.user.id`.
   - `deleteProject`: Remove a project if `studentId === req.user.id`.
2. **Configure Routes**: Link controllers in `backend/src/routes/project.routes.js`:
   - Use `authMiddleware` to secure write/edit endpoints.
3. **Export and Integrate**: Import and mount the router in `backend/src/app.js` under `/api/projects`.

### Frontend Tasks
1. **Create API Methods**: Add HTTP requests (`get`, `post`, `put`, `delete`) in `frontend/src/api/project.api.js`.
2. **Build Pages**:
   - `CreateProjectPage.jsx`: Form with validation (title, description, coverImage URL, extra images) to submit new showcases.
   - `EditProjectPage.jsx`: Fetch details and update form fields.
3. **Configure Navigation**: Add `/upload` and `/my-portfolio` paths to `frontend/src/routing/navigationConfig.js` under the `STUDENT` role.

---

## Member 2: Social System (Likes & Follows)
* **Branch Name**: `feat/member2-social-system`
* **Focus Area**: Enable recruiters to like projects and follow student profiles.

### Backend Tasks
1. **Create Like Controller**: Write logic in `backend/src/controllers/like.controller.js`:
   - `toggleLike`: Add a new `Like` document or delete it if it already exists (toggling like status).
2. **Create Follow Controller**: Write logic in `backend/src/controllers/follow.controller.js`:
   - `toggleFollow`: Add or remove a `Follower` document mapping the follower (`req.user.id`) to the followed student.
3. **Configure Routes**: Define routes in `backend/src/routes/like.routes.js` and `backend/src/routes/follow.routes.js` (secured with `authMiddleware`). Use `roleMiddleware('RECRUITER')` to restrict access.
4. **Export and Integrate**: Mount routers in `backend/src/app.js` under `/api/likes` and `/api/follows`.

### Frontend Tasks
1. **Create API Methods**: Add requests in `frontend/src/api/like.api.js` and `frontend/src/api/follow.api.js`.
2. **Integrate Buttons**:
   - Add a Like button/counter inside project cards in the home feed.
   - Add a Follow button next to the student's name on project detail views.

---

## Member 3: Event-Driven Notifications
* **Branch Name**: `feat/member3-event-notifications`
* **Focus Area**: Generate system notifications asynchronously using events whenever projects are created or liked.

### Backend Tasks
1. **Implement Event Bus**: Set up Node's `EventEmitter` in `backend/src/events/eventBus.js` as a singleton.
2. **Define Listeners**: In `backend/src/events/listeners.js`, subscribe to:
   - `project:created`: Create `Notification` documents for all users following the student creator.
   - `project:liked`: Create a `Notification` document for the project's owner (e.g., "Mary liked your project").
3. **Emit Events**: Emit these events from Member 1's `createProject` controller and Member 2's `toggleLike` controller.
4. **Create Notification APIs**: In `backend/src/controllers/notification.controller.js`, implement:
   - `getNotifications`: Fetch notifications for the logged-in user.
   - `markAsRead`: Update the `isRead` flag to `true`.
5. **Configure Routes**: Define routes in `backend/src/routes/notification.routes.js` and mount under `/api/notifications` in `app.js`.

### Frontend Tasks
1. **Create API Methods**: Add requests in `frontend/src/api/notification.api.js`.
2. **Build Notifications Indicator**: Add a bell icon dropdown or sidebar widget in the global `Navbar.jsx` showing unread counts and a list of notifications.

---

## Member 4: Admin Dashboard & Moderation
* **Branch Name**: `feat/member4-admin-moderation`
* **Focus Area**: Moderation portal for system admins to inspect active accounts and delete inappropriate listings.

### Backend Tasks
1. **Create Controller**: Write logic in `backend/src/controllers/admin.controller.js`:
   - `getAllUsers`: Fetch details of all registered users.
   - `getAllProjects`: Fetch all project submissions across the platform.
   - `deleteProject`: Remove any project (moderation action).
2. **Configure Routes**: Define routes in `backend/src/routes/admin.routes.js`.
   - **Crucial**: Secure these routes using BOTH `authMiddleware` and `roleMiddleware('ADMIN')`.
3. **Export and Integrate**: Mount the router in `backend/src/app.js` under `/api/admin`.

### Frontend Tasks
1. **Create API Methods**: Add admin actions in `frontend/src/api/admin.api.js`.
2. **Build Page**:
   - `AdminPage.jsx`: A dashboard visible only to users with the `ADMIN` role. Render lists of users and all projects, providing "Delete Project" buttons.
3. **Configure Navigation**: Add `/admin` path to `frontend/src/routing/navigationConfig.js` under the `ADMIN` role.

---

## Member 5: Documentation, Diagrams & Deployment
* **Branch Name**: `feat/member5-docs-deployment`
* **Focus Area**: Deliver system architecture diagrams, REST API specification, and deploy variables.

### Documentation Tasks
1. **ER Diagram**: Design the entity relationships between the MongoDB collections:
   - `User` 1:N `Project`
   - `User` 1:N `Like` / `Project` 1:N `Like`
   - `User` (Follower) 1:N `Follower` / `User` (Following) 1:N `Follower`
   - `User` 1:N `Notification`
2. **Sequence Diagrams**:
   - *OAuth Login Flow*: Redirect -> Consent -> Token exchange -> Role Check/Selection -> Session start.
   - *Create Project*: Request -> DB save -> Emit `project:created` event -> Create Notifications.
   - *Like Project*: Recruiter click -> Controller -> Toggle DB record -> Emit `project:liked` event -> Create Notification.
3. **API Documentation**: Document all request payloads, query parameters, and JSON response formats for backend routes.

### Deployment Tasks
1. **Build Scripts**: Configure environment variables (`MONGODB_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) for production.
2. **Hosting Setup**: Set up staging deployments (e.g., Render/Railway for backend, Vercel/Netlify for Vite frontend).
