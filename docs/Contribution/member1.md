# Member 1 (SE/2022/004)

As the Project Management (CRUD) developer for the DevCanvas project, I was responsible for implementing the complete project management module. My work focused on enabling students to create, view, update, and delete project showcases while ensuring secure access and seamless integration between the frontend and backend.

## 1. Project CRUD Backend Development
* **Project Controller:** Developed `project.controller.js` to implement all CRUD operations for project management.
* **Create Project:** Implemented functionality to create new project posts linked to the authenticated student's account (`req.user.id`).
* **View Projects:** Implemented APIs to retrieve all projects and individual project details using Mongoose `populate()` to display student information.
* **Update Project:** Added secure update functionality, allowing only the project owner to edit their own projects.
* **Delete Project:** Implemented secure project deletion with ownership validation to prevent unauthorized access.

## 2. API Routing & Integration
* **Project Routes:** Configured Express routes in `project.routes.js` for all CRUD endpoints.
* **Authentication:** Protected create, update, and delete operations using `authMiddleware`.
* **Application Integration:** Registered the project routes in `app.js` under the `/api/projects` endpoint for frontend communication.

## 3. Frontend API Development
* **API Layer:** Created `project.api.js` to centralize all project-related API requests using Axios.
* **Implemented Requests:**
  * Create Project (`POST`)
  * Get All Projects (`GET`)
  * Get Project by ID (`GET`)
  * Update Project (`PUT`)
  * Delete Project (`DELETE`)

## 4. Project Management User Interface
* **Create Project Page:** Developed a responsive project upload page with form validation for title, description, cover image, and additional images.
* **Edit Project Page:** Built the project editing interface by loading existing project data and allowing authenticated users to update project information.
* **Navigation Configuration:** Added **Upload Project** and **My Portfolio** routes for users with the **STUDENT** role.

## 5. Security & Authorization
* **Ownership Validation:** Ensured that only the project owner could update or delete a project by comparing `studentId` with `req.user.id`.
* **Protected Endpoints:** Secured all write operations using JWT authentication middleware to prevent unauthorized access.

## 6. Feature Integration & Testing
* **System Integration:** Connected the project management module with the existing authentication system and application routing.
* **Notification Integration:** Triggered the `project:created` event after successful project creation, enabling the notification system to generate follower notifications.
* **Testing & Verification:** Verified backend functionality using `npm run dev` and confirmed frontend compilation using `npm run build` before submitting Pull Requests.

## 7. Git Workflow & Collaboration
* **Feature Branch:** Completed all development within the `feat/member1-project-crud` feature branch.
* **Version Control:** Followed the team's Git workflow by committing changes with meaningful commit messages, pushing the feature branch to GitHub, and creating Pull Requests for code review before merging into the `main` branch.