import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
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

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Events API
export const eventsAPI = {
  getEvents: (params = {}) => api.get('/events', { params }),
  getEvent: (id) => api.get(`/events/${id}`),
  getEventByInviteLink: (link) => api.get(`/events/invite/${link}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  getMyEvents: () => api.get('/events/my-events'),
};

// RSVP API
export const rsvpAPI = {
  createRSVP: (eventId, rsvpData) => api.post(`/rsvp/${eventId}`, rsvpData),
  getEventRSVPs: (eventId) => api.get(`/rsvp/${eventId}`),
  getMyRSVPs: () => api.get('/rsvp/my-rsvps'),
  getMyRSVPForEvent: (eventId) => api.get(`/rsvp/${eventId}/my-response`),
  deleteRSVP: (eventId) => api.delete(`/rsvp/${eventId}`),
};

export default api;
