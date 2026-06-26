# Member 3: Event-Driven Notifications Task Sheet

* **Branch Name**: `feat/member3-event-notifications`
* **Focus Area**: Generate system notifications asynchronously using events whenever projects are created or liked.

---

## 1. Branch Setup
Execute the following commands in your terminal:
```bash
git checkout main
git pull origin main
git checkout -b feat/member3-event-notifications
```

---

## 2. Backend Tasks

### File to create: `backend/src/events/eventBus.js`
Create Node's EventEmitter singleton:
```javascript
import { EventEmitter } from 'events';
const eventBus = new EventEmitter();
export default eventBus;
```

### File to create: `backend/src/events/listeners.js`
Import `eventBus` and register listeners:
* `project:created`: Get follower list for the creator (query `Follower` collection). Create a `Notification` document for each follower: `"Name published a new project."`
* `project:liked`: Get the project's owner. Create a `Notification` document for them: `"Name liked your project."`
* `user:followed`: Create a `Notification` document for the student followed: `"Name started following you."`

*Import this `listeners.js` file in `backend/src/index.js` to ensure the listeners run.*

### Files to create:
* `backend/src/controllers/notification.controller.js`:
  - `getNotifications`: Fetch active notifications for `req.user.id` (sorted by newest).
  - `markAsRead`: Update `isRead: true` for the specified notification ID.
* `backend/src/routes/notification.routes.js`: Expose routes `GET /` and `PATCH /:id/read` (secured with `authMiddleware`).

### File to modify: `backend/src/app.js`
* Mount the notifications router:
  ```javascript
  import notificationRoutes from './routes/notification.routes.js';
  app.use('/api/notifications', notificationRoutes);
  ```

---

## 3. Frontend Tasks

### File to create: `frontend/src/api/notification.api.js`
Expose endpoints:
* `getNotifications()` -> `api.get('/notifications')`
* `markAsRead(id)` -> `api.patch('/notifications/' + id + '/read')`

### File to modify: `frontend/src/components/Navbar.jsx`
* Create a notification panel/bell dropdown.
* Fetch notifications on mount, show a unread count badge, and provide "Mark as Read" buttons next to listings.

---

## 4. Verification Check
Run compilation checks before opening a Pull Request:
* Backend: Start server with `npm run dev` to verify imports and routes are correct.
* Frontend: Compile production bundle with `npm run build` to verify syntax.
