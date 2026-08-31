# 🎨 DevCanvas — Student Project Showcase Portal

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Asgardeo](https://img.shields.io/badge/Asgardeo-FF7300?style=for-the-badge&logo=wso2&logoColor=white)
![Security](https://img.shields.io/badge/Security-OIDC_%7C_RBAC_%7C_OWASP-blue?style=for-the-badge&logo=shield)

---

## 📌 About the Project

DevCanvas is a Student Project Showcase Portal that allows students to create and manage project portfolios while enabling other users to discover and view student projects.

The existing Student Project Showcase Portal was enhanced for the Information Security module assignment by implementing additional security mechanisms including OIDC authentication, access-token validation, role-based access control, resource ownership protection, input validation, secure file uploads, and secure configuration.

---

## ✨ Features

### 👨‍🎓 Student
* Create and manage student profiles
* Create and manage project portfolios
* Add project descriptions and technologies
* Add GitHub and demo links
* Upload project images
* View personal projects

### 🔍 Project Discovery
* Browse student projects
* View project details
* View student information and technologies
* Access project GitHub and demo links

### 👨‍💼 Administration
* Manage users
* View projects
* Delete projects
* Manage user access

---

## 🔐 Security Enhancements

The main focus of this version was to improve the security of the original DevCanvas application according to the security requirements of the Information Security module assignment.

### 1. OIDC Authentication with Asgardeo
The application uses Asgardeo as the Identity Provider (IdP) with OpenID Connect (OIDC) for user authentication.
The application supports secure:
* User login
* User logout
* Authenticated user identification

Authentication is handled through the OIDC authentication flow rather than implementing authentication credentials directly within the application.

### 2. Authenticated User Information
User information is obtained from the authenticated identity provided by Asgardeo.
The authenticated user's identity is used by the backend when performing protected operations instead of relying on user identity information supplied by the client.
This ensures that protected operations are associated with the authenticated user.

### 3. Access Token Validation
Access tokens obtained from the Identity Provider are validated by the backend before protected resources can be accessed.
Token validation includes:
* JWT signature verification using Asgardeo JWKS
* RS256 signature verification
* Issuer (`iss`) validation
* Audience (`aud`) validation
* Expiration (`exp`) validation

The validated access token is used to identify and authorize the authenticated user.

### 4. Role-Based Access Control (RBAC)
Access to protected functionality is controlled according to user roles.
The application supports the following roles:
* `STUDENT`
* `RECRUITER`
* `ADMIN`

The backend verifies the authenticated user's role before allowing access to protected endpoints.
This prevents users from accessing functionality that is not permitted for their assigned role.

### 5. Ownership and IDOR Protection
The backend verifies resource ownership before allowing users to modify or delete their projects.
The authenticated user's identity is obtained from the server-side authentication context rather than trusting a user ID supplied by the client.
This helps prevent Insecure Direct Object Reference (IDOR) attacks by ensuring that users cannot modify or delete resources belonging to other users.

### 6. Input Validation and Injection Protection
User-supplied identifiers are validated before being used in database operations.
MongoDB ObjectIds are checked for validity and invalid identifiers are rejected before database queries are performed.
This reduces the risk of malformed or malicious input being used in MongoDB database operations.

### 7. Secure File Uploads
Project image uploads are restricted by file type and file size.
Supported image formats are:
* JPEG
* PNG
* WebP

The maximum upload size is 10 MB.
Uploaded images are stored using Cloudinary rather than being stored directly in the application server.

### 8. Security Headers and CORS
The backend uses Helmet to provide security-related HTTP headers.
CORS is configured to restrict cross-origin requests to the configured frontend origin.
These controls help reduce security risks associated with insecure HTTP headers and unauthorized cross-origin requests.

### 9. Secure Configuration
Sensitive configuration values are stored using environment variables rather than being hard-coded in the source code.
Sensitive values include:
* MongoDB connection details
* Asgardeo Client ID
* Asgardeo Client Secret
* Cloudinary API credentials

Environment files containing secrets are excluded from the public GitHub repository.

### 10. OWASP Top 10 Security Considerations
Security controls were implemented to address relevant OWASP Top 10 risks within the application.
These include:
* **Broken Access Control** — RBAC and server-side resource ownership verification
* **Cryptographic Failures / Sensitive Data Exposure** — sensitive credentials are stored in environment variables rather than source code
* **Injection** — input validation and MongoDB ObjectId validation
* **Identification and Authentication Failures** — OIDC authentication and access-token validation
* **Security Misconfiguration** — Helmet, restricted CORS, and secure configuration management
* **Software and Data Integrity Failures** — authenticated and authorized API operations
* **Security Logging and Error Handling** — controlled error responses and production error-message sanitization

Only the OWASP risks relevant to the application's implemented functionality were considered.

---

## 🛠️ Technologies Used

| Category | Technologies |
| :--- | :--- |
| **Frontend** | React.js, Vite, React Router, Axios, CSS |
| **Backend** | Node.js, Express.js, Mongoose |
| **Database** | MongoDB, MongoDB Atlas / Local MongoDB |
| **Authentication & Security** | Asgardeo, OpenID Connect (OIDC), JWT, Role-Based Access Control, Helmet, CORS, Multer |
| **Image Storage** | Cloudinary |

---

## 📁 Project Structure

```text
dev-canvas/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── ...
│   │
│   ├── scripts/
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── docs/
│   ├── ASGARDEO_SETUP.md
│   └── SECURITY.md
│
└── README.md
```

---

## 🚀 Setup and Installation

Follow the steps below to run DevCanvas locally.

### Prerequisites
Make sure the following are installed:
* Node.js 18 or later
* npm
* MongoDB or a MongoDB Atlas account

You will also need:
* An Asgardeo account
* A Cloudinary account

### 1. Clone the Repository
```bash
git clone https://github.com/Pabodha-Wann/dev-canvas.git
cd dev-canvas
```

### 2. Install Backend Dependencies
Navigate to the backend directory:
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

---

## 🗄️ Database Configuration

DevCanvas uses MongoDB for storing application data.
You can use either a local MongoDB installation or MongoDB Atlas.

### Local MongoDB
Make sure MongoDB is running locally and configure:
```env
MONGODB_URI=mongodb://localhost:27017/devcanvas
```

### MongoDB Atlas
Create a MongoDB Atlas cluster and obtain the connection string.
Example:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/devcanvas
```
Replace the placeholders with your own credentials.

---

## 🔑 Environment Configuration

Sensitive configuration values are not included in this public repository.

### Backend Environment Variables
Inside the backend directory, create a file named:
```text
.env
```
Add the required configuration:
```env
PORT=3000

MONGODB_URI=your_mongodb_connection_string

CLIENT_URL=http://localhost:5173
SERVER_URL=http://localhost:3000

NODE_ENV=development

# Asgardeo OIDC
ASGARDEO_CLIENT_ID=your_client_id
ASGARDEO_CLIENT_SECRET=your_client_secret
ASGARDEO_TENANT=your_tenant_name
ASGARDEO_BASE_URL=https://api.asgardeo.io/t/your_tenant_name
ASGARDEO_ISSUER=https://api.asgardeo.io/t/your_tenant_name/oauth2/token
ASGARDEO_REDIRECT_URI=http://localhost:3000/api/auth/asgardeo/callback
ASGARDEO_SCOPES=openid profile email

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```
Replace all placeholder values with your own configuration.

### Frontend Environment Variables
Inside the frontend directory, create:
```text
.env
```
Add:
```env
VITE_API_URL=http://localhost:3000/api
```

---

## 🔐 Asgardeo Configuration

An Asgardeo OIDC application is required for authentication.

1. **Create an OIDC Application**  
   Create an OIDC application in your Asgardeo organization.

2. **Configure the Callback URL**  
   For local development, configure:
   ```text
   http://localhost:3000/api/auth/asgardeo/callback
   ```

3. **Configure the Required Scopes**  
   Use:
   ```text
   openid profile email
   ```

4. **Configure Environment Variables**  
   Add the Asgardeo configuration values to the backend `.env` file:
   ```env
   ASGARDEO_CLIENT_ID=your_client_id
   ASGARDEO_CLIENT_SECRET=your_client_secret
   ASGARDEO_TENANT=your_tenant_name
   ```

Additional configuration details can be found in:
* `docs/ASGARDEO_SETUP.md`

---

## ☁️ Cloudinary Configuration

DevCanvas uses Cloudinary for storing project images.

1. **Create a Cloudinary Account**  
   Create a Cloudinary account and open the Cloudinary dashboard.

2. **Obtain the Credentials**  
   You will need:
   * Cloud Name
   * API Key
   * API Secret

3. **Add the Credentials**  
   Add them to the backend `.env` file:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
   *Do not commit the Cloudinary API Secret to GitHub.*

---

## ▶️ Running the Application

The frontend and backend must be started separately.

### 1. Start the Backend
Open a terminal and run:
```bash
cd backend
npm run dev
```
The backend runs on:
```text
http://localhost:3000
```
Keep this terminal running.

### 2. Start the Frontend
Open a new terminal and run:
```bash
cd frontend
npm run dev
```
The frontend runs on:
```text
http://localhost:5173
```

### 3. Open the Application
Open the following address in your browser:
```text
http://localhost:5173
```
The application should now be running.  
You can test the authentication flow by logging in through Asgardeo.

---

## 📚 Documentation

Additional documentation is available in the `docs` directory:
* `docs/ASGARDEO_SETUP.md` — Asgardeo OIDC configuration
* `docs/SECURITY.md` — Security implementation details

---

## 👤 Author

**Dinuja Ranaweera**  
SE/2022/026  

DevCanvas was enhanced for the Information Security module assignment by improving the security of the existing Student Project Showcase Portal through OIDC authentication, access-token validation, role-based access control, resource ownership protection, input validation, secure file uploads, and secure configuration.
