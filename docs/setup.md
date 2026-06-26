# Project Cloning & Setup Guide

Welcome to the DevCanvas Student Project Showcase Portal. Follow this guide to clone the repository, install all dependencies, configure environment files, and start your local development environment.

---

## 1. Prerequisites
Ensure you have the following installed on your machine:
* **Node.js** (v18+ recommended)
* **npm** (v9+ recommended)
* **Git**
* **MongoDB** (running locally or a MongoDB Atlas cloud URI)

---

## 2. Clone the Repository
Clone the project repository to your local machine and navigate into the project directory:
```bash
git clone <repository-url>
cd dev-canvas
```
*(Replace `<repository-url>` with your team's Git repository URL.)*

---

## 3. Install Dependencies
The project is divided into two main folders: `backend` and `frontend`. You must install dependencies inside both folders.

### Setup Backend:
```bash
cd backend
npm install
```

### Setup Frontend:
Open a new terminal window or return to the project root and navigate to the frontend:
```bash
cd frontend
npm install
```

---

## 4. Configure Environment Variables
You do not need to create or set up a local database. Pre-configured `.env` files containing the shared database connection URIs and credentials will be provided to you by the project lead.

Simply ensure that:
* The `.env` file for the backend is placed inside the `backend/` directory.
* The `.env` file for the frontend is placed inside the `frontend/` directory.

*(If you need to check these values, the backend `.env` should contain `MONGODB_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `CLIENT_URL`, and `PORT`, while the frontend `.env` should contain `VITE_API_URL`.)*

---

## 5. Running the Application Locally

You will need two terminal instances running concurrently.

### Start the Backend Server:
```bash
cd backend
npm run dev
```
You should see: `MongoDB Connected: <host>` and `Server running on http://localhost:3000` in the output.

### Start the Frontend Server:
```bash
cd frontend
npm run dev
```
You should see a Vite prompt with the local URL: `http://localhost:5173/`. Open this link in your browser to interact with the application.
