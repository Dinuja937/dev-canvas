import React from 'react';
import useAuthStore from '../store/authStore';
import { authService } from '../services/auth.service';

const HomePage = () => {
  const { user } = useAuthStore();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.logo}>🎓 DevCanvas</div>
        <div style={styles.profileArea}>
          {user && (
            <>
              {user.profilePic && <img src={user.profilePic} alt={user.name} style={styles.avatar} />}
              <div style={styles.userInfo}>
                <span style={styles.userName}>{user.name}</span>
                <span style={styles.userRoleBadge}>{user.role}</span>
              </div>
            </>
          )}
          <button onClick={authService.logout} style={styles.logoutBtn}>Logout</button>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.heroSection}>
          <h1 style={styles.title}>Student Project Showcase Portal</h1>
          <p style={styles.subtitle}>Discover, browse, and appreciate cutting-edge projects built by our computing students.</p>
        </section>

        <section style={styles.feed}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Featured Projects</h2>
          </div>
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>🚀</span>
            <h3 style={styles.emptyTitle}>No Projects Yet</h3>
            <p style={styles.emptyDescription}>Check back soon or create your own project to show the world!</p>
          </div>
        </section>
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0c',
    color: '#f8fafc',
    fontFamily: "'Outfit', 'Inter', sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    background: 'rgba(10, 10, 12, 0.8)',
    backdropFilter: 'blur(10px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: '22px',
    fontWeight: '700',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px',
  },
  profileArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid #6366f1',
    objectFit: 'cover',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#e2e8f0',
  },
  userRoleBadge: {
    fontSize: '11px',
    fontWeight: '700',
    color: '#818cf8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginTop: '2px',
  },
  logoutBtn: {
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'transparent',
    color: '#f8fafc',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    transition: 'all 0.2s',
  },
  main: {
    flex: 1,
    padding: '40px',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  heroSection: {
    textAlign: 'center',
    padding: '60px 20px',
    borderRadius: '24px',
    background: 'radial-gradient(ellipse at center, rgba(99, 102, 241, 0.1) 0%, rgba(10, 10, 12, 0) 70%)',
    marginBottom: '40px',
  },
  title: {
    fontSize: '48px',
    fontWeight: '800',
    margin: '0 0 16px 0',
    letterSpacing: '-1px',
  },
  subtitle: {
    fontSize: '18px',
    color: '#94a3b8',
    maxWidth: '650px',
    margin: '0 auto',
    lineHeight: '1.6',
  },
  feed: {
    marginTop: '20px',
  },
  sectionHeader: {
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '12px',
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '600',
    margin: 0,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '80px 20px',
    border: '1px dashed rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.01)',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '20px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 8px 0',
  },
  emptyDescription: {
    color: '#64748b',
    fontSize: '15px',
    margin: 0,
  },
};

export default HomePage;
