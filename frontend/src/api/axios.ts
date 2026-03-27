import axios from "axios";

// Dynamically determine API base URL based on environment
const getBaseURL = () => {
  // Check if we're in a localhost environment
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const port = window.location.port;
    
    // If localhost or 127.0.0.1, connect directly to backend
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return "http://localhost:3001/api";
    }
    
    // For other environments (github.dev, etc), use relative path with timeout and retry
    return "/api";
  }
  
  return "/api";
};

export const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000, // 10 second timeout
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - backend may not be responding');
    } else if (error.message === 'Network Error') {
      console.error('Network error - check backend connection');
    }
    return Promise.reject(error);
  }
);
