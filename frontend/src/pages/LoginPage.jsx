import React from 'react';

const LoginPage = () => {
  const handleGoogleLogin = () => {
    // Redirect to backend OAuth route
    window.location.href = 'http://localhost:3000/api/auth/google';
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <span style={styles.logoIcon}>🎓</span>
            <h1 style={styles.logoText}>DevCanvas</h1>
          </div>
          <p style={styles.subtitle}>Student Project Showcase Portal</p>
        </div>

        <div style={styles.body}>
          <p style={styles.description}>
            Showcase your hard work, connect with recruiters, and discover incredible projects built by peers.
          </p>

          <button onClick={handleGoogleLogin} style={styles.googleButton}>
            <svg style={styles.googleIcon} viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582l3.51-3.51C17.742 1.055 14.914 0 12 0 7.354 0 3.307 2.67 1.304 6.605l3.962 3.16z"
              />
              <path
                fill="#4285F4"
                d="M16.04 15.345c-1.077.733-2.502 1.182-4.04 1.182a7.07 7.07 0 0 1-6.734-4.856l-3.962 3.16C3.307 21.33 7.354 24 12 24c4.682 0 8.7-2.618 10.745-6.436l-3.99-3.091-2.715.872z"
              />
              <path
                fill="#34A853"
                d="M22.745 17.564c-.08-.182-2.715-5.218-10.745-5.218a7.09 7.09 0 0 0-6.734 4.856l3.962 3.16A4.908 4.908 0 0 1 12 16.909c2.473 0 4.195 1.527 4.195 1.527l3.99 3.091c.08-.182 1.836-3.218 2.56-4.963z"
              />
              <path
                fill="#FBBC05"
                d="M23.491 12.273c0-.818-.073-1.609-.209-2.382H12v4.564h6.491a5.54 5.54 0 0 1-2.4 3.655l3.99 3.091c2.327-2.145 3.673-5.3 3.673-8.927z"
              />
            </svg>
            Sign in with Google
          </button>
        </div>

        <div style={styles.footer}>
          <p style={styles.footerText}>Faculty of Computing &copy; 2026</p>
        </div>
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
    maxWidth: '420px',
    width: '100%',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  header: {
    marginBottom: '32px',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    marginBottom: '8px',
  },
  logoIcon: {
    fontSize: '32px',
  },
  logoText: {
    fontSize: '28px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0,
    letterSpacing: '-0.5px',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '14px',
    margin: 0,
    fontWeight: '500',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  body: {
    width: '100%',
    marginBottom: '32px',
  },
  description: {
    color: '#cbd5e1',
    fontSize: '15px',
    lineHeight: '1.6',
    marginBottom: '32px',
  },
  googleButton: {
    width: '100%',
    padding: '14px 20px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: '#ffffff',
    color: '#0f172a',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    outline: 'none',
  },
  googleIcon: {
    width: '20px',
    height: '20px',
  },
  footer: {
    marginTop: 'auto',
  },
  footerText: {
    color: '#64748b',
    fontSize: '12px',
    margin: 0,
  },
};

export default LoginPage;
