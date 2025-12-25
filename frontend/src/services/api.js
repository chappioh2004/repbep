import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance
const apiClient = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem('repbep_auth');
    if (auth) {
      const { token } = JSON.parse(auth);
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

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('repbep_auth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (data) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },
  login: async (data) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },
  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// Profile API
export const profileAPI = {
  update: async (data) => {
    const response = await apiClient.put('/profile', data);
    return response.data;
  },
};

// Projects API
export const projectsAPI = {
  getAll: async () => {
    const response = await apiClient.get('/projects');
    return response.data;
  },
  create: async (data) => {
    const response = await apiClient.post('/projects', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await apiClient.put(`/projects/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  },
};

// Chat API
export const chatAPI = {
  sendMessage: async (data) => {
    const response = await apiClient.post('/chat/message', data);
    return response.data;
  },
  getConversations: async () => {
    const response = await apiClient.get('/chat/conversations');
    return response.data;
  },
  getProjectConversations: async (projectId) => {
    const response = await apiClient.get(`/chat/conversations/${projectId}`);
    return response.data;
  },
};

export default apiClient;
