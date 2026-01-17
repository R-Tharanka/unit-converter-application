// services/api.js
// Centralized axios instance — sets baseURL and injects Authorization header.
// Also handles 401 responses globally to force a client-side logout/redirect.

import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api'
});

// Attach JWT token automatically (from localStorage)
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Global response handler: if a 401 occurs, token is invalid/expired -> clear local storage and redirect to /auth
api.interceptors.response.use(
    response => response,
    (error) => {
        if (error?.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('email');
            // Force a hard redirect to /auth so app reloads state (simple and reliable)
            if (typeof window !== 'undefined') {
                window.location.href = '/auth';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
