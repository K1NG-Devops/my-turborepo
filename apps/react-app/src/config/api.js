// API Configuration
const getApiUrl = () => {
  if (import.meta.env.MODE === 'production') {
    return import.meta.env.VITE_API_URL || 'https://youngeagles-api-server.up.railway.app';
  }
  const url = import.meta.env.VITE_API_URL || 'http://localhost';
  const port = import.meta.env.VITE_API_PORT || '3000';
  return port ? `${url}:${port}` : url;
};

export const API_BASE_URL = getApiUrl();
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
    TEACHER_LOGIN: `${API_BASE_URL}/api/auth/teacher-login`,
    ADMIN_LOGIN: `${API_BASE_URL}/api/auth/admin-login`,
  },
  HOMEWORK: {
    BASE: `${API_BASE_URL}/api/homework`,
    FOR_PARENT: (parentId) => `${API_BASE_URL}/api/homework/for-parent/${parentId}`,
    SUBMIT: `${API_BASE_URL}/api/homework/submit`,
  },
  FCM: {
    TOKEN: `${API_BASE_URL}/api/fcm/token`,
  },
  ATTENDANCE: {
    BASE: `${API_BASE_URL}/api/attendance`,
  }
};

// Helper function for making API requests
export const apiRequest = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

