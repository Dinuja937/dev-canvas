# Team Leader (My Contribution)

As the Team Leader for the DevCanvas project, I was responsible for the core infrastructure, initial scaffolding, authentication, and overall system architecture that enabled the rest of the team to work on their individual components seamlessly.

## 1. Project Initialization & Architecture Setup
* **Scaffolding:** Initialized the monorepo structure with a dedicated `frontend` (Vite + React) and `backend` (Node.js + Express).
* **Decoupled Architecture:** Established the MVC-like structure for the backend (`routes`, `controllers`, `services`, `models`) ensuring clean code separation.
* **Frontend Setup:** Configured React Router for protected/public routes, Tailwind CSS for styling, and Axios for API communication.
* **State Management:** Integrated **Zustand** for lightweight, global state management (e.g., handling the logged-in user session across the app).

## 2. Database Configuration & Models
* **MongoDB Setup:** Configured the `mongoose` connection to MongoDB Atlas.
* **Environment Variables:** Set up `dotenv` to manage sensitive secrets (DB URIs, JWT keys, Google Client IDs) safely.
* **Core Schemas:** Designed and implemented *all* foundational Mongoose models for the system (`User`, `Project`, `Like`, `Follower`, `Notification`), handling role validation (`STUDENT`, `RECRUITER`, `ADMIN`), array tracking, and data relationships.

## 3. Authentication, Authorization & Security
* **Passport.js Integration:** Implemented the complete Google OAuth 2.0 flow using `passport-google-oauth20`.
* **JWT & Middleware Construction:** Built the core token generation logic (`jwt.sign`) and developed both the `authMiddleware.js` (for validating JWT tokens and securing routes) and the `roleMiddleware.js` (for restricting access based on user roles).
* **Role Selection Flow:** Developed the custom logic that intercepts new users coming from Google and redirects them to a Role Selection page before finalizing their account creation.

## 4. UI/UX & Layout Design
* **Global Components:** Developed the core shell of the application, including the interactive `Navbar` (with role-based links) and the `Hero` section.
* **Styling Leadership:** Established the design language (fonts, premium styling, backdrop blurs, no-scrollbar utilities) for the team to follow.
* **Responsive Design:** Ensured the base application is mobile-responsive using Tailwind CSS breakpoints.

## 5. Core Feature Refinement & Integration
* **Image Uploads:** Configured `multer` with a 5MB memory storage limit and integrated **Cloudinary** for cloud image hosting, which the Project Management member utilized.
* **Dynamic Search:** Developed the real-time client-side search functionality on the Home page, allowing users to filter by title, description, tags, or student name.
* **UI Bug Fixes:** Refined complex UI components, such as the `NotificationBell` alignment, scrollbar hiding, and interactive hover states.
* **Delete Functionality:** Implemented the custom React confirmation modal for deleting projects to replace standard browser alerts.

## 6. DevOps & Deployment
* **Deployment & Hosting Setup:** Researched and executed staging deployments, hosting the frontend on Vercel and the backend on Render.
* **Environment Configuration:** Handled the configuration of production environment variables (`MONGODB_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) across the hosting platforms.
* **Git Workflow Enforcement:** Created the `team_tasks.md` and enforced the branching strategy to prevent merge conflicts.
