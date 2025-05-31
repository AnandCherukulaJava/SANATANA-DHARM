import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { forgotPassword, clearError, clearMessage } from '../store/authSlice';
import LoadingSpinner from '../components/LoadingSpinner';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

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
    },
    title: {
      textAlign: 'center',
      marginBottom: '2rem',
      color: '#333',
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    description: {
      textAlign: 'center',
      marginBottom: '2rem',
      color: '#666',
      lineHeight: '1.5',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    input: {
      padding: '0.75rem',
      border: '1px solid #ddd',
      borderRadius: '5px',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.3s',
    },
    button: {
      padding: '0.75rem',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'transform 0.2s',
    },
    error: {
      color: '#e74c3c',
      textAlign: 'center',
      marginBottom: '1rem',
    },
    success: {
      color: '#27ae60',
      textAlign: 'center',
      marginBottom: '1rem',
    },
    links: {
      textAlign: 'center',
      marginTop: '1rem',
    },
    link: {
      color: '#667eea',
      textDecoration: 'none',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🕉️ SANATANA-DHARM</h1>
        <h2 style={{ textAlign: 'center', marginBottom: '1rem', color: '#666' }}>Forgot Password</h2>
        
        <p style={styles.description}>
          Enter your email address and we'll send you a link to reset your password.
        </p>
        
        {error && <div style={styles.error}>{error}</div>}
        {message && <div style={styles.success}>{message}</div>}
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
            <button
              type="submit"
              style={styles.button}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Send Reset Link
            </button>
          </form>
        )}
        
        <div style={styles.links}>
          <span>Remember your password? </span>
          <Link to="/login" style={styles.link}>Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;