import axios from 'axios';

// API Base URL - Change this to your backend URL
export const API_BASE_URL = 'https://resume-builder-5-900u.onrender.com/api';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // Time expired
      window.location.href = '/time-expired';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  // Resume endpoints
  checkTime: '/resume/check-time',
  saveResume: '/resume/save',
  downloadPdf: (id) => `/resume/download-pdf/${id}`,
  sendEmail: (id) => `/resume/send-email/${id}`,
  sendWhatsApp: (id) => `/resume/send-whatsapp/${id}`,
  
  // Admin endpoints
  getAllResumes: '/admin/resumes',
  getResume: (id) => `/admin/resume/${id}`,
  updateResume: (id) => `/admin/resume/${id}`,
  deleteResume: (id) => `/admin/resume/${id}`,
};