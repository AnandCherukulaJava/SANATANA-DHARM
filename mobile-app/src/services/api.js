import axios from 'axios';

const API_BASE_URL = 'https://work-1-nedwsbjkdouwcmux.prod-runtime.all-hands.dev/api';

// Create axios instance
const apiService = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiService.interceptors.request.use(
  (config) => {
    // Get token from storage (you might want to use AsyncStorage in React Native)
    const token = global.authToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling token refresh
apiService.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = global.refreshToken;
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken: refreshToken,
          });

          const { token, refreshToken: newRefreshToken } = response.data;
          
          // Update global tokens
          global.authToken = token;
          global.refreshToken = newRefreshToken;

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiService(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        global.authToken = null;
        global.refreshToken = null;
        // You might want to navigate to login screen here
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { apiService };