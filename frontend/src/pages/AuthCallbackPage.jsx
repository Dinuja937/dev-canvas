import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/auth.service';
import useAuthStore from '../store/authStore';

const AuthCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setToken(token);
      authService.getMe().then(() => {
        const user = useAuthStore.getState().user;
        if (user && user.isNewUser) {
          navigate('/select-role');
        } else {
          navigate('/');
        }
      });
    } else {
      navigate('/login');
    }
  }, [searchParams, setToken, navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
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
        borderLeftColor: '#818cf8',
        animation: 'spin 1s linear infinite',
        marginBottom: '16px'
      }}></div>
      <p style={{ color: '#94a3b8', fontSize: '16px', fontWeight: '500' }}>Completing login...</p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AuthCallbackPage;
