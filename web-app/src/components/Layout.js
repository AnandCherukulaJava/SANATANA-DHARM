import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../store/authSlice';

const Layout = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const styles = {
    layout: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    nav: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
    },
    navButton: {
      background: 'rgba(255,255,255,0.2)',
      border: 'none',
      color: 'white',
      padding: '0.5rem 1rem',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'background 0.3s',
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    main: {
      flex: 1,
      padding: '2rem',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    },
  };

  return (
    <div style={styles.layout}>
      <header style={styles.header}>
        <div style={styles.logo} onClick={() => navigate('/')}>
          🕉️ SANATANA-DHARM
        </div>
        {isAuthenticated && (
          <nav style={styles.nav}>
            <div style={styles.userInfo}>
              <span>Welcome, {user?.username || user?.firstName || 'User'}</span>
              {user?.roles?.includes('ADMIN') && (
                <button
                  style={styles.navButton}
                  onClick={() => navigate('/admin')}
                  onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                  onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
                >
                  Admin Panel
                </button>
              )}
              <button
                style={styles.navButton}
                onClick={() => navigate('/dashboard')}
                onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              >
                Dashboard
              </button>
              <button
                style={styles.navButton}
                onClick={handleLogout}
                onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.3)'}
                onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
              >
                Logout
              </button>
            </div>
          </nav>
        )}
      </header>
      <main style={styles.main}>
        {children}
      </main>
    </div>
  );
};

export default Layout;