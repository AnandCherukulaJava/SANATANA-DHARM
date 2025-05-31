import axios from 'axios';

const API_BASE_URL = 'https://work-1-nedwsbjkdouwcmux.prod-runtime.all-hands.dev/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await api.post('/auth/refresh-token', {
            refreshToken: refreshToken,
          });
          
          const { token } = response.data;
          localStorage.setItem('token', token);
          
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/signup', userData),
  login: (credentials) => api.post('/auth/signin', credentials),
  logout: () => api.post('/auth/signout'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  getDashboard: () => api.get('/user/dashboard'),
};

export const adminAPI = {
  getAllUsers: () => api.get('/admin/users'),
  getUserById: (id) => api.get(`/admin/users/${id}`),
  getAllRoles: () => api.get('/admin/roles'),
  getDashboard: () => api.get('/admin/dashboard'),
  enableUser: (id) => api.put(`/admin/users/${id}/enable`),
  disableUser: (id) => api.put(`/admin/users/${id}/disable`),
};

export const testAPI = {
  publicAccess: () => api.get('/test/all'),
  userAccess: () => api.get('/test/user'),
  adminAccess: () => api.get('/test/admin'),
  superUserAccess: () => api.get('/test/superuser'),
  superAdminAccess: () => api.get('/test/superadmin'),
};

export default api;