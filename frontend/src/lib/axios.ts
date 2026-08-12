import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { isAdminApiRequest } from '../features/admin/auth/adminRequest';
import { queryClient } from './queryClient';

// Backend is running on port 3000
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach token to requests
api.interceptors.request.use(
  (config) => {
    // Only in browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        queryClient.removeQueries({ queryKey: ['admin'] });
        useAuthStore.getState().logout();
      }
    }
    if (
      error.response?.status === 403 &&
      isAdminApiRequest(error.config?.url)
    ) {
      const requestPath = error.config?.url?.split('?')[0] ?? '';
      if (!requestPath.endsWith('/admin/stats')) {
        // A domain rule can also return 403 (for example, a forbidden edit).
        // Re-check the dedicated authorization endpoint before revoking UI
        // access instead of treating every 403 as proof of lost membership.
        void queryClient.refetchQueries({
          queryKey: ['admin', 'stats'],
          type: 'active',
        });
      }
    }
    return Promise.reject(error);
  }
);
