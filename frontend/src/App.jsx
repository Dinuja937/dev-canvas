import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import ProtectedRoute from './routing/ProtectedRoute';

import { authService } from './services/auth.service';

import Layout from './components/Layout';

// Pages
import LoginPage from './pages/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import SelectRolePage from './pages/SelectRolePage';
import HomePage from './pages/HomePage';

function App() {
  useEffect(() => {
    authService.getMe();
  }, []);

  return (
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

        {/* Protected Core Routes (wrapped in global Layout) */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
