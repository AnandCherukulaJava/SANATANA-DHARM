import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, Link } from 'react-router-dom';
import { verifyEmail, clearError, clearMessage } from '../store/authSlice';
import LoadingSpinner from '../components/LoadingSpinner';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(verifyEmail(token));
    }
  }, [token, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [dispatch]);

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    card: {
      background: 'white',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center',
    },
    title: {
      marginBottom: '2rem',
      color: '#333',
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    icon: {
      fontSize: '4rem',
      marginBottom: '1rem',
    },
    error: {
      color: '#e74c3c',
      marginBottom: '1rem',
    },
    success: {
      color: '#27ae60',
      marginBottom: '1rem',
    },
    link: {
      color: '#667eea',
      textDecoration: 'none',
      padding: '0.75rem 1.5rem',
      border: '2px solid #667eea',
      borderRadius: '5px',
      display: 'inline-block',
      marginTop: '1rem',
      transition: 'all 0.3s',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🕉️ SANATANA-DHARM</h1>
        
        {loading ? (
          <>
            <div style={styles.icon}>⏳</div>
            <h2>Verifying your email...</h2>
            <LoadingSpinner />
          </>
        ) : error ? (
          <>
            <div style={styles.icon}>❌</div>
            <h2>Verification Failed</h2>
            <div style={styles.error}>{error}</div>
            <Link 
              to="/login" 
              style={styles.link}
              onMouseOver={(e) => {
                e.target.style.background = '#667eea';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#667eea';
              }}
            >
              Go to Login
            </Link>
          </>
        ) : message ? (
          <>
            <div style={styles.icon}>✅</div>
            <h2>Email Verified Successfully!</h2>
            <div style={styles.success}>{message}</div>
            <Link 
              to="/login" 
              style={styles.link}
              onMouseOver={(e) => {
                e.target.style.background = '#667eea';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#667eea';
              }}
            >
              Login Now
            </Link>
          </>
        ) : (
          <>
            <div style={styles.icon}>❓</div>
            <h2>Invalid Verification Link</h2>
            <p>The verification link is invalid or has expired.</p>
            <Link 
              to="/login" 
              style={styles.link}
              onMouseOver={(e) => {
                e.target.style.background = '#667eea';
                e.target.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#667eea';
              }}
            >
              Go to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;