import axios from 'axios';

// Create an Axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    // Get the auth token from localStorage (if available)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common response scenarios
apiClient.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it
    return response;
  },
  (error) => {
    // Handle common error scenarios
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data } = error.response;
      
      // Handle unauthorized responses (401)
      if (status === 401) {
        // Clear the invalid token
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
        }
        // Optionally redirect to login page
        // You can implement this later when you have routing set up
        console.warn('Unauthorized access. Token may be expired.');
      }
      
      // Handle other error statuses
      console.error(`API Error ${status}:`, data?.message || 'Unknown error');
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error: No response received from server');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
