import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { authService } from '../services/auth.service';

const SelectRolePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, user } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If redirected with token, store it first
  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      setToken(token);
    }
  }, [searchParams, setToken]);

  const handleSubmit = async () => {
    if (!selectedRole) {
      setErrorMsg('Please select a role to continue.');
      return;
    }
    setErrorMsg('');
    setSubmitting(true);
    const res = await authService.selectRole(selectedRole);
    setSubmitting(false);
    if (res.success) {
      navigate('/');
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Choose Your Account Type</h1>
        <p style={styles.subtitle}>Welcome to DevCanvas! Are you showcases projects or looking to hire?</p>
        
        {errorMsg && <div style={styles.error}>{errorMsg}</div>}

        <div style={styles.options}>
          <div 
            onClick={() => setSelectedRole('STUDENT')}
            style={{
              ...styles.optionCard,
              ...(selectedRole === 'STUDENT' ? styles.optionCardSelected : {})
            }}
          >
            <div style={styles.icon}>👨‍💻</div>
            <h3 style={styles.optionTitle}>Student / Creator</h3>
            <p style={styles.optionDescription}>Showcase your amazing projects, build your portfolio, and get discovered by recruiters.</p>
          </div>

          <div 
            onClick={() => setSelectedRole('RECRUITER')}
            style={{
              ...styles.optionCard,
              ...(selectedRole === 'RECRUITER' ? styles.optionCardSelected : {})
            }}
          >
            <div style={styles.icon}>🔍</div>
            <h3 style={styles.optionTitle}>Recruiter / Reviewer</h3>
            <p style={styles.optionDescription}>Browse innovative student projects, like your favorites, and follow top talent.</p>
          </div>
        </div>

        <button 
          onClick={handleSubmit} 
          disabled={submitting} 
          style={{
            ...styles.submitBtn,
            ...(submitting ? styles.submitBtnDisabled : {})
          }}
        >
          {submitting ? 'Setting up account...' : 'Continue to Dashboard'}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'radial-gradient(circle at 10% 20%, #1e1e24 0%, #0d0d11 90%)',
    fontFamily: "'Outfit', 'Inter', sans-serif",
    padding: '20px',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.03)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '24px',
    padding: '40px',
    maxWidth: '750px',
    width: '100%',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: '0 0 12px 0',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '16px',
    marginBottom: '32px',
    maxWidth: '500px',
    lineHeight: '1.5',
  },
  error: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#ef4444',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    borderRadius: '8px',
    padding: '12px',
    marginBottom: '24px',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
  },
  options: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
    width: '100%',
    marginBottom: '36px',
  },
  optionCard: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.06)',
    borderRadius: '16px',
    padding: '30px',
    cursor: 'pointer',
    transition: 'all 0.25s ease',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  optionCardSelected: {
    background: 'rgba(99, 102, 241, 0.08)',
    border: '2px solid #6366f1',
    boxShadow: '0 0 20px rgba(99, 102, 241, 0.25)',
  },
  icon: {
    fontSize: '44px',
    marginBottom: '16px',
  },
  optionTitle: {
    color: '#f8fafc',
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 10px 0',
  },
  optionDescription: {
    color: '#94a3b8',
    fontSize: '14px',
    lineHeight: '1.6',
    margin: 0,
  },
  submitBtn: {
    padding: '14px 40px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
};

export default SelectRolePage;
