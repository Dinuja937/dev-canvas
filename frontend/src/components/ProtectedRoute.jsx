import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuthStore();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#0a0a0c',
        color: '#ffffff',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          border: '4px solid rgba(255, 255, 255, 0.1)',
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          borderLeftColor: '#6366f1',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
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
