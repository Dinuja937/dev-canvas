import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthStore from './store/authStore';
import ProtectedRoute from './routing/ProtectedRoute';

import { authService } from './services/auth.service';

import Layout from './components/Layout';

// Pages
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import SelectRolePage from './pages/SelectRolePage';
import HomePage from './pages/HomePage';
import CreateProjectPage from './pages/CreateProjectPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import EditProjectPage from './pages/EditProjectPage';
import AdminPage from './pages/AdminPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  useEffect(() => {
    authService.getMe();
  }, []);

  return (
    <>
      <ToastContainer position="bottom-right" autoClose={4000} hideProgressBar={true} theme="colored" />
      <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Protected Onboarding Route */}
        <Route
          path="/select-role"
          element={
            <ProtectedRoute>
              <SelectRolePage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all Redirect */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<CreateProjectPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/upload"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <CreateProjectPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-project/:id"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <EditProjectPage />
              </ProtectedRoute>
            }
          />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route
            path="/my-portfolio"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Redirect inside layout to prevent navbar unmounting */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
