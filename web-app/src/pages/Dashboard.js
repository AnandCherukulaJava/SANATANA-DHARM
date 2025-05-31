import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDashboard, getUserProfile } from '../store/userSlice';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { dashboard, profile, loading, error } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUserDashboard());
    dispatch(getUserProfile());
  }, [dispatch]);

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    header: {
      background: 'white',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '2rem',
      textAlign: 'center',
    },
    title: {
      color: '#333',
      marginBottom: '1rem',
      fontSize: '2.5rem',
    },
    subtitle: {
      color: '#666',
      fontSize: '1.2rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '2rem',
      marginBottom: '2rem',
    },
    card: {
      background: 'white',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    cardTitle: {
      color: '#333',
      marginBottom: '1rem',
      fontSize: '1.5rem',
      borderBottom: '2px solid #667eea',
      paddingBottom: '0.5rem',
    },
    infoItem: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.5rem 0',
      borderBottom: '1px solid #eee',
    },
    label: {
      fontWeight: 'bold',
      color: '#555',
    },
    value: {
      color: '#333',
    },
    error: {
      color: '#e74c3c',
      textAlign: 'center',
      padding: '2rem',
      background: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
  };

  if (loading) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div style={styles.error}>
          <h2>Error loading dashboard</h2>
          <p>{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Welcome to Your Dashboard</h1>
          <p style={styles.subtitle}>
            Hello, {user?.firstName || user?.username || 'User'}! 
            Here's your personal dashboard.
          </p>
        </div>

        <div style={styles.grid}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Profile Information</h2>
            {profile ? (
              <>
                <div style={styles.infoItem}>
                  <span style={styles.label}>Username:</span>
                  <span style={styles.value}>{profile.username || 'N/A'}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.label}>Email:</span>
                  <span style={styles.value}>{profile.email || 'N/A'}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.label}>First Name:</span>
                  <span style={styles.value}>{profile.firstName || 'N/A'}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.label}>Last Name:</span>
                  <span style={styles.value}>{profile.lastName || 'N/A'}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.label}>Phone:</span>
                  <span style={styles.value}>{profile.phoneNumber || 'N/A'}</span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.label}>Roles:</span>
                  <span style={styles.value}>
                    {profile.roles ? profile.roles.join(', ') : 'USER'}
                  </span>
                </div>
              </>
            ) : (
              <p>Loading profile information...</p>
            )}
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Dashboard Statistics</h2>
            {dashboard ? (
              <>
                <div style={styles.infoItem}>
                  <span style={styles.label}>Account Status:</span>
                  <span style={styles.value}>
                    {dashboard.accountStatus || 'Active'}
                  </span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.label}>Member Since:</span>
                  <span style={styles.value}>
                    {dashboard.memberSince || 'N/A'}
                  </span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.label}>Last Login:</span>
                  <span style={styles.value}>
                    {dashboard.lastLogin || 'N/A'}
                  </span>
                </div>
                <div style={styles.infoItem}>
                  <span style={styles.label}>Total Logins:</span>
                  <span style={styles.value}>
                    {dashboard.totalLogins || '0'}
                  </span>
                </div>
              </>
            ) : (
              <p>Loading dashboard statistics...</p>
            )}
          </div>

          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Quick Actions</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                style={{
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Update Profile
              </button>
              <button
                style={{
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                Change Password
              </button>
              <button
                style={{
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
              >
                View Activity Log
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;