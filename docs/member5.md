# Member 5: Documentation, Diagrams & Deployment Task Sheet

* **Branch Name**: `feat/member5-docs-deployment`
* **Focus Area**: Deliver system architecture diagrams, REST API documentation, and hosting/deployment setups.

---

## 1. Branch Setup
Execute the following commands in your terminal:
```bash
git checkout main
git pull origin main
git checkout -b feat/member5-docs-deployment
```

---

## 2. Documentation Tasks

### File to create: `docs/database_design.md` (ER Diagram)
* Write a clear entity relationship representation (e.g. using Mermaid or text descriptions) outlining:
  - `User` 1:N `Project`
  - `User` 1:N `Like` / `Project` 1:N `Like` (Unique compound indexes)
  - `User` (Follower) 1:N `Follower` / `User` (Following) 1:N `Follower`
  - `User` 1:N `Notification`

### File to create: `docs/sequence_diagrams.md`
Provide sequence workflows (using Mermaid syntax) for:
* **OAuth Login**: User -> Frontend -> Backend (Passport) -> Google Consent -> Code Exchange -> JWT Issued -> Select Role (if new) -> Start Session.
* **Create Project**: Student -> Submit Form -> Express Controller -> MongoDB save -> Emit `project:created` event -> Listeners generate Notifications for followers.
* **Like Project**: Recruiter -> Click Like -> Toggle DB -> Emit `project:liked` event -> Listener creates notification for project owner.

### File to create: `docs/api_specification.md`
Expose all backend endpoints:
* Route, HTTP Method, Authentication requirements, Request payload/query params, and JSON Success/Error response structures for all API paths.

---

## 3. Deployment Tasks

### Configuration
1. Coordinate with Team Lead to retrieve production hosting accounts (e.g., Render, Vercel, MongoDB Atlas).
2. Set up environment variables on the backend hosting platform:
   - `MONGODB_URI` (Atlas database connection URL)
   - `JWT_SECRET`
   - `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` (configured with production callback URL: `https://[backend-domain]/api/auth/google/callback`)
   - `CLIENT_URL` (production frontend domain)
3. Configure the frontend build endpoint:
   - Add build/Vite environment variable: `VITE_API_URL` pointing to the hosted backend domain.

---

## 4. Verification Check
Run compilation checks before opening a Pull Request:
* Frontend: Compile production bundle with `npm run build` to verify syntax.
