import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen w-screen bg-white text-slate-800 font-sans">
        <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-l-purple-600 animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Force new users to complete role selection
  if (user?.isNewUser && location.pathname !== '/select-role') {
    return <Navigate to="/select-role" replace />;
  }

  // Check role authorization if roles are defined
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
