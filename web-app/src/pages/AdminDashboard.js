import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getAllUsers, 
  getAllRoles, 
  getAdminDashboard, 
  enableUser, 
  disableUser,
  clearAdminError,
  clearAdminMessage 
} from '../store/adminSlice';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, roles, dashboard, loading, error, message } = useSelector((state) => state.admin);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    dispatch(getAdminDashboard());
    dispatch(getAllUsers());
    dispatch(getAllRoles());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        dispatch(clearAdminMessage());
      }, 3000);
    }
  }, [message, dispatch]);

  const handleUserToggle = (userId, isEnabled) => {
    if (isEnabled) {
      dispatch(disableUser(userId));
    } else {
      dispatch(enableUser(userId));
    }
  };

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
    tabs: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
    },
    tab: {
      padding: '0.75rem 1.5rem',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontSize: '1rem',
    },
    activeTab: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
    },
    inactiveTab: {
      background: 'white',
      color: '#667eea',
      border: '2px solid #667eea',
    },
    card: {
      background: 'white',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      marginBottom: '2rem',
    },
    cardTitle: {
      color: '#333',
      marginBottom: '1rem',
      fontSize: '1.5rem',
      borderBottom: '2px solid #667eea',
      paddingBottom: '0.5rem',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem',
    },
    statCard: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '1.5rem',
      borderRadius: '10px',
      textAlign: 'center',
    },
    statNumber: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
    },
    statLabel: {
      fontSize: '1rem',
      opacity: 0.9,
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '1rem',
    },
    th: {
      background: '#f8f9fa',
      padding: '1rem',
      textAlign: 'left',
      borderBottom: '2px solid #dee2e6',
      fontWeight: 'bold',
      color: '#333',
    },
    td: {
      padding: '1rem',
      borderBottom: '1px solid #dee2e6',
    },
    button: {
      padding: '0.5rem 1rem',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      transition: 'all 0.3s',
    },
    enableButton: {
      background: '#28a745',
      color: 'white',
    },
    disableButton: {
      background: '#dc3545',
      color: 'white',
    },
    message: {
      padding: '1rem',
      borderRadius: '5px',
      marginBottom: '1rem',
      textAlign: 'center',
    },
    success: {
      background: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb',
    },
    error: {
      background: '#f8d7da',
      color: '#721c24',
      border: '1px solid #f5c6cb',
    },
  };

  if (loading && !users.length) {
    return (
      <Layout>
        <LoadingSpinner />
      </Layout>
    );
  }

  const renderDashboard = () => (
    <>
      <div style={styles.grid}>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{users.length}</div>
          <div style={styles.statLabel}>Total Users</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{users.filter(u => u.enabled).length}</div>
          <div style={styles.statLabel}>Active Users</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{roles.length}</div>
          <div style={styles.statLabel}>Total Roles</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statNumber}>{dashboard?.totalLogins || 0}</div>
          <div style={styles.statLabel}>Total Logins</div>
        </div>
      </div>
    </>
  );

  const renderUsers = () => (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>User Management</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Roles</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td style={styles.td}>{user.username}</td>
              <td style={styles.td}>{user.email}</td>
              <td style={styles.td}>{`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A'}</td>
              <td style={styles.td}>{user.roles ? user.roles.join(', ') : 'USER'}</td>
              <td style={styles.td}>
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '3px',
                  fontSize: '0.8rem',
                  background: user.enabled ? '#d4edda' : '#f8d7da',
                  color: user.enabled ? '#155724' : '#721c24',
                }}>
                  {user.enabled ? 'Active' : 'Disabled'}
                </span>
              </td>
              <td style={styles.td}>
                <button
                  style={{
                    ...styles.button,
                    ...(user.enabled ? styles.disableButton : styles.enableButton),
                  }}
                  onClick={() => handleUserToggle(user.id, user.enabled)}
                  onMouseOver={(e) => e.target.style.opacity = '0.8'}
                  onMouseOut={(e) => e.target.style.opacity = '1'}
                >
                  {user.enabled ? 'Disable' : 'Enable'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderRoles = () => (
    <div style={styles.card}>
      <h2 style={styles.cardTitle}>Role Management</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Role Name</th>
            <th style={styles.th}>Description</th>
            <th style={styles.th}>Users Count</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id}>
              <td style={styles.td}>{role.name}</td>
              <td style={styles.td}>{role.description || 'N/A'}</td>
              <td style={styles.td}>{role.userCount || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <Layout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Admin Dashboard</h1>
          <p>Manage users, roles, and system settings</p>
        </div>

        {message && (
          <div style={{...styles.message, ...styles.success}}>
            {message}
          </div>
        )}

        {error && (
          <div style={{...styles.message, ...styles.error}}>
            {error}
          </div>
        )}

        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'dashboard' ? styles.activeTab : styles.inactiveTab),
            }}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'users' ? styles.activeTab : styles.inactiveTab),
            }}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'roles' ? styles.activeTab : styles.inactiveTab),
            }}
            onClick={() => setActiveTab('roles')}
          >
            Roles
          </button>
        </div>

        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'roles' && renderRoles()}
      </div>
    </Layout>
  );
};

export default AdminDashboard;