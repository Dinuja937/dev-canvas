# Member 2: Social System (Likes & Follows) Task Sheet

* **Branch Name**: `feat/member2-social-system`
* **Focus Area**: Enable recruiters to like projects and follow student profiles.

---

## 1. Branch Setup
Execute the following commands in your terminal:
```bash
git checkout main
git pull origin main
git checkout -b feat/member2-social-system
```

---

## 2. Backend Tasks

### File to create: `backend/src/controllers/like.controller.js`
* Implement `toggleLike`:
  - Check if a `Like` document already exists with `{ userId: req.user.id, projectId: req.body.projectId }`.
  - If it exists, delete it (unlike).
  - If it doesn't exist, create it (like) and emit an event:
    ```javascript
    eventBus.emit('project:liked', { userId: req.user.id, projectId: req.body.projectId });
    ```

### File to create: `backend/src/controllers/follow.controller.js`
* Implement `toggleFollow`:
  - Check if a `Follower` document exists with `{ followerId: req.user.id, followingId: req.body.followingId }`.
  - If it exists, delete it (unfollow).
  - If it doesn't exist, create it (follow) and emit an event:
    ```javascript
    eventBus.emit('user:followed', { followerId: req.user.id, followingId: req.body.followingId });
    ```

### Files to create:
* `backend/src/routes/like.routes.js` (Route: `POST /toggle` -> secure with `authMiddleware` + `roleMiddleware('RECRUITER')`).
* `backend/src/routes/follow.routes.js` (Route: `POST /toggle` -> secure with `authMiddleware` + `roleMiddleware('RECRUITER')`).

### File to modify: `backend/src/app.js`
* Mount both routers:
  ```javascript
  import likeRoutes from './routes/like.routes.js';
  import followRoutes from './routes/follow.routes.js';
  
  app.use('/api/likes', likeRoutes);
  app.use('/api/follows', followRoutes);
  ```

---

## 3. Frontend Tasks

### Files to create:
* `frontend/src/api/like.api.js`: `toggleLike(projectId)` -> `api.post('/likes/toggle', { projectId })`
* `frontend/src/api/follow.api.js`: `toggleFollow(followingId)` -> `api.post('/follows/toggle', { followingId })`

### File to modify: `frontend/src/pages/HomePage.jsx`
* Render a Like button on project cards.
* Trigger `toggleLike` and dynamically update the button color (light-purple fill on active) and count.

### File to modify: `frontend/src/pages/ProjectDetailPage.jsx`
* Render a "Follow Student" button next to the student's name profile segment.
* Disable/enable the button based on the logged-in user's role (only available for `RECRUITER` accounts).

---

## 4. Verification Check
Run compilation checks before opening a Pull Request:
* Backend: Start server with `npm run dev` to verify imports and routes are correct.
* Frontend: Compile production bundle with `npm run build` to verify syntax.
