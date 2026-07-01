# Member 4 - SE/2022/024 (Admin Dashboard & Moderation) 

As the Admin Dashboard & Moderation developer for the DevCanvas project, I was responsible for implementing the administration module. My work focused on creating a secure moderation portal for system administrators to view registered accounts, inspect all uploaded projects, and delete inappropriate content.

## 1. Moderation Portal Backend Development
* **Admin Controller:** Developed `admin.controller.js` to implement all administrative moderation functions:
  * `getAllUsers`: Fetches and lists all registered user accounts with counts.
  * `getAllProjects`: Retrieves all project submissions, utilizing `.populate()` to include owner metadata.
  * `deleteProject`: Safely deletes any projects by ID from the database.

## 2. API Routing, Mount & Security
* **Admin Routes:** Created `admin.routes.js` to define and secure all administrator routes.
* **Role-Based Guards:** Enforced high-level security using both `authMiddleware` and `roleMiddleware('ADMIN')` on all administration paths.
* **App Mounting:** Registered the admin router in `app.js` under the `/api/admin` endpoint prefix.

## 3. Frontend API Integration
* **API Client Layer:** Built `admin.api.js` to export central Axios requests matching backend endpoints:
  * `getAllUsers` -> `api.get('/admin/users')`
  * `getAllProjects` -> `api.get('/admin/projects')`
  * `deleteProject` -> `api.delete('/admin/projects/' + id)`

## 4. Admin Dashboard User Interface
* **Scaffold & Stats:** Designed a premium administration layout shell in `AdminPage.jsx` featuring dynamic status counters (`Total Users`, `Total Projects`).
* **Interactive Tabs:** Structured tab navigation separating the **Users** and **Projects** views.
* **Users Tab Table:** Mapped the users list to display profile pictures/initials, full names, email addresses, color-coded role tags, and registration dates.

## 5. Projects Moderation & Deletion Handler
* **Projects Grid:** Developed a responsive grid displaying project cards with cover photos, titles, descriptions, owner info, and creation dates.
* **Deletion Action:** Integrated a red "Delete Project" button with a confirmation dialog box (`window.confirm`) to request deletion from the database and optimistically update the client state without requiring a full page refresh.

## 6. Route Registration & Access
* **Navigation Links:** Added the **Admin Dashboard** option in both desktop profile dropdown and mobile side drawer (exclusive to authenticated `ADMIN` users).
* **Route Configuration:** Added `/admin` page matching in `App.jsx` restricted via `<ProtectedRoute allowedRoles={['ADMIN']}>`.

## 7. Version Control & verification
* **Branching Strategy:** Conducted all work on the `feat/member4-admin-moderation` feature branch.
* **Compilation Checks:** Ran node checks and build steps to verify that backend and frontend modules compiled cleanly before submitting the Pull Request.
