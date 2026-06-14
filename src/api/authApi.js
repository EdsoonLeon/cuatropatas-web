import api from './axiosConfig';

export const authApi = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data),
  me: () => api.get('/api/auth/me'),
  refreshToken: (data) => api.post('/api/auth/refresh-token', data),
  logout: (data) => api.post('/api/auth/logout', data),
  changePassword: (data) => api.post('/api/auth/change-password', data),
};
